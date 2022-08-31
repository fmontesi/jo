/*
   Copyright 2018   Fabrizio Montesi <famontesi@gmail.com>, et. al.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

interface JolieFault extends Error {
  isFault: boolean;
  fault: Error;
}

interface FetchParams extends RequestInit {
  service: string;
  headers: Record<string, string>;
  method: string;
  data: any;
}

interface FetchBuilder {
  (
    data: Object,
    params: any,
    method: "GET" | "POST" | "DELETE" | "HEAD" | "PATCH" | "OPTIONS" | "PUT"
  ): Promise<any>;
}

function toJson(response: Response): Promise<any> {
  return response.json();
}

function genError(response: Response): Promise<any> {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return response.json().then((json) => {
      const error: JolieFault = {
        name: response.statusText,
        message: response.statusText,
        isFault: true,
        fault: json.error,
      };
      error.isFault = true;
      error.fault = json.error;
      throw error;
    });
  }
}

function jolieFetch(operation: string, params: FetchParams): Promise<any> {
  if (typeof params.service === "undefined") {
    operation = "/" + operation;
  } else {
    if (!params.service.startsWith("/")) {
      params.service = "/" + params.service;
    }
    operation = "/!" + params.service + "!/" + operation;
  }
  params.headers = { "Content-Type": "application/json" };

  if (typeof params.method === "undefined") {
    params.method = "POST";
  }

  if (typeof params.data !== "undefined") {
    if (params.method === "GET" || params.method === "HEAD") {
      operation += "?" + JSON.stringify(params.data);
    } else {
      params.body = JSON.stringify(params.data);
    }
  }

  return fetch(operation, params).then(genError).then(toJson);
}

function initParams(data: Object, params: any): FetchParams {
  if (typeof params === "undefined") {
    params = {};
  }
  if (typeof data !== "undefined") {
    params.data = data;
  }
  return params;
}

const proxyBuilder = (service: string) => {
  return new Proxy(
    {},
    {
      get: (target, prop, receiver) => {
        return (data: Object, params:any) => {
          params = initParams(data, params);
          params.service = service;
          return jolieFetch(prop.toString(), params);
        };
      },
    }
  );
};

const buildHttpVerbs = (buildFetch: FetchBuilder) => {
  return {
    get: (data: Object, params: any) => {
      return buildFetch(data, params, "GET");
    },
    post: (data: Object, params: any) => {
      return buildFetch(data, params, "POST");
    },
    delete: (data: Object, params: any) => {
      return buildFetch(data, params, "DELETE");
    },
    head: (data: Object, params: any) => {
      return buildFetch(data, params, "HEAD");
    },
    patch: (data: Object, params: any) => {
      return buildFetch(data, params, "PATCH");
    },
    options: (data: Object, params: any) => {
      return buildFetch(data, params, "OPTIONS");
    },
    put: (data: Object, params: any) => {
      return buildFetch(data, params, "PUT");
    },
  };
};

const resourceProxyBuilder = (service: string) => {
  return new Proxy(
    {},
    {
      get: (target, prop, receiver) => {
        const buildFetch: FetchBuilder = (data, params, method) => {
          const fetchParams: FetchParams = initParams(data, params);
          fetchParams.service = service;
          fetchParams.method = method;
          return jolieFetch(prop.toString(), fetchParams);
        };
        return buildHttpVerbs(buildFetch);
      },
    }
  );
};

export const Jo = new Proxy(proxyBuilder, {
  get: (target, prop, receiver) => {
    return (data: Object, params: any) => {
      const fetchParams = initParams(data, params);
      return jolieFetch(prop.toString(), fetchParams);
    };
  },
});

export const Jor = new Proxy(resourceProxyBuilder, {
  get: (target, prop, receiver) => {
    return (data: Object, params: any) => {
      const buildFetch: FetchBuilder = (data, params, method) => {
        const fetchParams = initParams(data, params);
        fetchParams.method = method;
        return jolieFetch(prop.toString(), fetchParams);
      };
      return buildHttpVerbs(buildFetch);
    };
  },
});

export const JoHelp = {
  parseError: (error: JolieFault) => {
    if (error.isFault) {
      return Promise.reject(JSON.stringify(error.fault));
    } else {
      return Promise.reject(error.message);
    }
  },
};
