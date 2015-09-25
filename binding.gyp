{
  "targets": [
    {
      "target_name": "IrSdkNodeBindings",
      "cflags": [ "-Wall", "-std=c++11" ],
      "sources": [ "src/cpp/IrSdkNodeBindings.cpp", "src/cpp/IRSDKWrapper.cpp", "src/cpp/irbitfield_helpers.cpp" ],
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