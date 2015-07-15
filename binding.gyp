{
  "targets": [
    {
      "target_name": "irsdknodewrapper",
      "cflags": [ "-Wall", "-std=c++11" ],
      "sources": [ "src/cpp/node-wrapper.cpp", "src/cpp/IRSDKWrapper.cpp", "src/cpp/irbitfield_helpers.cpp" ],
      "default_configuration": "Release",
      "configurations": {
        "Release": { 
          "msvs_settings": {
            "VCCLCompilerTool": {
                "ExceptionHandling": 1
            }
          }
        }
      }
    }
  ]
}