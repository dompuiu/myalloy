// - This dude acts as a Components repo.
// - It also implements all of the Core's lifecycle hooks.

// Let's start the first version with an explicit Hook interface,
// and not a random pub/sub model. Meaning each Component will have
// to implement the hook it's interested in as a method on its prototype.

// We will have a Plop helper that generates Components and populate all the
// hooks as Template methods.

// TODO: Finalize the first set of Lifecycle hooks. (DONE)
// TODO: Support Async hooks. (Or maybe default them as Async)
// TODO: Hooks might have to publish events so the outside world can hooks in as well.

// MAYBE: If a Component has a hard dependency, or maybe CORE can do this:
// if (core.hasComponent('Personalization')) {
//  new Error() or core.missingRequirement('I require Personalization');
// }

function invokeHook(components, hook, ...args) {
  return components.map(component => {
    // TODO Maybe add a smarter check here to help Components' developers
    // know that their hooks should be organized under `lifecycle`.
    // Maybe check if hook exist directly on the instance, throw.
    return component.lifecycle &&
      typeof component.lifecycle[hook] === "function"
      ? component.lifecycle[hook](...args)
      : undefined;
  });
}

export default componentRegistry => {
  const components = componentRegistry.getAll();
  return {
    onComponentsRegistered(core) {
      return invokeHook(components, "onComponentsRegistered", core);
    },
    onBeforeViewStart(payload) {
      return invokeHook(components, "onBeforeViewStart", payload);
    },
    onViewStartResponse(response) {
      return invokeHook(components, "onViewStartResponse", response);
    },
    onBeforeEvent(payload) {
      return invokeHook(componentRegistry.getAll(), "onBeforeEvent", payload);
    },
    onEventResponse(response) {
      return invokeHook(components, "onEventResponse", response);
    },
    onBeforeUnload() {
      return invokeHook(components, "onBeforeUnload");
    },
    onOptInChanged(permissions) {
      return invokeHook(components, "onOptInChanged", permissions);
    }
    // TODO: We might need an `onError(error)` hook.
  };
};