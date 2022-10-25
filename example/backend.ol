

interface BackendInterface {
RequestResponse:
	test( void )( int )
}

service Backend {
	execution: concurrent

	inputPort Input {
		location: "local"
		interfaces: BackendInterface
	}

	main {
		test()(res){
            res = 1
		}
	}
}