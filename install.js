try {
  var Validate = require('git-validate');
  Validate.installHooks('pre-commit');
} catch (ex) {
  // dev dependencies not installed -> no hooks
}
