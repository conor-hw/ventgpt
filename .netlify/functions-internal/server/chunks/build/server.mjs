import { hasInjectionContext, getCurrentInstance, createApp, provide, toRef, onErrorCaptured, onServerPrefetch, unref, createVNode, resolveDynamicComponent, shallowReactive, reactive, effectScope, computed, defineComponent, h, isReadonly, isRef, isShallow, isReactive, toRaw, inject, defineAsyncComponent, mergeProps, ref, getCurrentScope, readonly, watch, nextTick, useSSRContext } from 'vue';
import { k as hasProtocol, l as isScriptProtocol, m as joinURL, w as withQuery, s as sanitizeStatusCode, n as getContext, $ as $fetch$1, o as createHooks, c as createError$1, p as isEqual, q as stringifyParsedURL, t as stringifyQuery, v as parseQuery, x as toRouteMatcher, y as createRouter, z as defu } from '../nitro/nitro.mjs';
import { b as baseURL } from '../routes/renderer.mjs';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode, ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { ExclamationTriangleIcon, HeartIcon, InformationCircleIcon, UserGroupIcon, AcademicCapIcon, SparklesIcon, LightBulbIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    versions: {
      get nuxt() {
        return "4.0.2";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin) {
  if (plugin.hooks) {
    nuxtApp.hooks.addHooks(plugin.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin) {
    const unresolvedPluginsForThisPlugin = plugin.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin).then(async () => {
        if (plugin._name) {
          resolvedPlugins.add(plugin._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin._name)) {
              dependsOn.delete(plugin._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin.parallel && !nuxtApp.payload.error) {
          throw error;
        }
        error ||= e;
      });
      if (plugin.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin);
  }
  for (const plugin of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin) {
  if (typeof plugin === "function") {
    return plugin;
  }
  const _name = plugin._name || plugin.name;
  delete plugin.name;
  return Object.assign(plugin.setup || (() => {
  }), plugin, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  manifest_45route_45rule
];
function getRouteFromPath(fullPath) {
  const route = fullPath && typeof fullPath === "object" ? fullPath : {};
  if (typeof fullPath === "object") {
    fullPath = stringifyParsedURL({
      pathname: fullPath.path || "",
      search: stringifyQuery(fullPath.query || {}),
      hash: fullPath.hash || ""
    });
  }
  const url = new URL(fullPath.toString(), "http://localhost");
  return {
    path: url.pathname,
    fullPath,
    query: parseQuery(url.search),
    hash: url.hash,
    // stub properties for compat with vue-router
    params: route.params || {},
    name: void 0,
    matched: route.matched || [],
    redirectedFrom: void 0,
    meta: route.meta || {},
    href: fullPath
  };
}
const router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  setup(nuxtApp) {
    const initialURL = nuxtApp.ssrContext.url;
    const routes = [];
    const hooks = {
      "navigate:before": [],
      "resolve:before": [],
      "navigate:after": [],
      "error": []
    };
    const registerHook = (hook, guard) => {
      hooks[hook].push(guard);
      return () => hooks[hook].splice(hooks[hook].indexOf(guard), 1);
    };
    (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const route = reactive(getRouteFromPath(initialURL));
    async function handleNavigation(url, replace) {
      try {
        const to = getRouteFromPath(url);
        for (const middleware of hooks["navigate:before"]) {
          const result = await middleware(to, route);
          if (result === false || result instanceof Error) {
            return;
          }
          if (typeof result === "string" && result.length) {
            return handleNavigation(result, true);
          }
        }
        for (const handler of hooks["resolve:before"]) {
          await handler(to, route);
        }
        Object.assign(route, to);
        if (false) ;
        for (const middleware of hooks["navigate:after"]) {
          await middleware(to, route);
        }
      } catch (err) {
        for (const handler of hooks.error) {
          await handler(err);
        }
      }
    }
    const currentRoute = computed(() => route);
    const router = {
      currentRoute,
      isReady: () => Promise.resolve(),
      // These options provide a similar API to vue-router but have no effect
      options: {},
      install: () => Promise.resolve(),
      // Navigation
      push: (url) => handleNavigation(url),
      replace: (url) => handleNavigation(url),
      back: () => (void 0).history.go(-1),
      go: (delta) => (void 0).history.go(delta),
      forward: () => (void 0).history.go(1),
      // Guards
      beforeResolve: (guard) => registerHook("resolve:before", guard),
      beforeEach: (guard) => registerHook("navigate:before", guard),
      afterEach: (guard) => registerHook("navigate:after", guard),
      onError: (handler) => registerHook("error", handler),
      // Routes
      resolve: getRouteFromPath,
      addRoute: (parentName, route2) => {
        routes.push(route2);
      },
      getRoutes: () => routes,
      hasRoute: (name) => routes.some((route2) => route2.name === name),
      removeRoute: (name) => {
        const index = routes.findIndex((route2) => route2.name === name);
        if (index !== -1) {
          routes.splice(index, 1);
        }
      }
    };
    nuxtApp.vueApp.component("RouterLink", defineComponent({
      functional: true,
      props: {
        to: {
          type: String,
          required: true
        },
        custom: Boolean,
        replace: Boolean,
        // Not implemented
        activeClass: String,
        exactActiveClass: String,
        ariaCurrentValue: String
      },
      setup: (props, { slots }) => {
        const navigate = () => handleNavigation(props.to, props.replace);
        return () => {
          const route2 = router.resolve(props.to);
          return props.custom ? slots.default?.({ href: props.to, navigate, route: route2 }) : h("a", { href: props.to, onClick: (e) => {
            e.preventDefault();
            return navigate();
          } }, slots);
        };
      }
    }));
    nuxtApp._route = route;
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const initialLayout = nuxtApp.payload.state._layout;
    nuxtApp.hooks.hookOnce("app:created", async () => {
      router.beforeEach(async (to, from) => {
        to.meta = reactive(to.meta || {});
        if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
          to.meta.layout = initialLayout;
        }
        nuxtApp._processingMiddleware = true;
        if (!nuxtApp.ssrContext?.islandContext) {
          const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
          {
            const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
            if (routeRules.appMiddleware) {
              for (const key in routeRules.appMiddleware) {
                const guard = nuxtApp._middleware.named[key];
                if (!guard) {
                  return;
                }
                if (routeRules.appMiddleware[key]) {
                  middlewareEntries.add(guard);
                } else {
                  middlewareEntries.delete(guard);
                }
              }
            }
          }
          for (const middleware of middlewareEntries) {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            {
              if (result === false || result instanceof Error) {
                const error = result || createError$1({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`,
                  data: {
                    path: initialURL
                  }
                });
                delete nuxtApp._processingMiddleware;
                return nuxtApp.runWithContext(() => showError(error));
              }
            }
            if (result === true) {
              continue;
            }
            if (result || result === false) {
              return result;
            }
          }
        }
      });
      router.afterEach(() => {
        delete nuxtApp._processingMiddleware;
      });
      await router.replace(initialURL);
      if (!isEqual(route.fullPath, initialURL)) {
        await nuxtApp.runWithContext(() => navigateTo(route.fullPath));
      }
    });
    return {
      provide: {
        route,
        router
      }
    };
  }
});
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8
];
const _sfc_main$7 = {
  __name: "CrisisBanner",
  __ssrInlineRender: true,
  setup(__props) {
    const showServices = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-red-50 border-b border-red-200" }, _attrs))}><div class="container mx-auto px-4 py-3"><div class="flex items-center justify-between"><div class="flex items-center space-x-3">`);
      _push(ssrRenderComponent(unref(ExclamationTriangleIcon), { class: "h-5 w-5 text-red-600" }, null, _parent));
      _push(`<span class="text-red-800 text-sm font-medium"> Crisis Support Available 24/7 </span><div class="flex space-x-4 text-sm"><a href="tel:116123" class="text-red-700 hover:text-red-900 font-semibold"> Samaritans: 116 123 </a><a href="tel:999" class="text-red-700 hover:text-red-900 font-semibold"> Emergency: 999 </a></div></div><button class="text-red-700 hover:text-red-900 text-sm font-medium">${ssrInterpolate(unref(showServices) ? "Hide" : "More Services")}</button></div>`);
      if (unref(showServices)) {
        _push(`<div class="mt-3 pt-3 border-t border-red-200"><div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"><div><h4 class="font-semibold text-red-800 mb-1">Ireland</h4><div class="space-y-1"><div>HSE: <a href="tel:1800111888" class="text-red-700 hover:underline">1800 111 888</a></div><div>Pieta: <a href="tel:1800247247" class="text-red-700 hover:underline">1800 247 247</a></div></div></div><div><h4 class="font-semibold text-red-800 mb-1">Text Support</h4><div class="space-y-1"><div>Text HELLO to <span class="font-mono">50808</span></div><div>Text HELP to <span class="font-mono">51444</span></div></div></div><div><h4 class="font-semibold text-red-800 mb-1">Online</h4><div class="space-y-1"><a href="https://samaritans.ie" target="_blank" class="text-red-700 hover:underline block">samaritans.ie</a><a href="https://pieta.ie" target="_blank" class="text-red-700 hover:underline block">pieta.ie</a></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CrisisBanner.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = {
  __name: "ChatHeader",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-center mb-8" }, _attrs))}><div class="flex items-center justify-center space-x-3 mb-4"><div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">`);
      _push(ssrRenderComponent(unref(HeartIcon), { class: "h-7 w-7 text-white" }, null, _parent));
      _push(`</div><div><h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> VentGPT </h1><p class="text-gray-600 text-sm">Your AI Mental Health Companion</p></div></div><div class="max-w-2xl mx-auto space-y-3"><div class="flex items-center justify-center space-x-2 text-sm text-green-600"><div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span>AI Companion Online &amp; Safe</span></div><div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800"><div class="flex items-start space-x-2">`);
      _push(ssrRenderComponent(unref(InformationCircleIcon), { class: "h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" }, null, _parent));
      _push(`<div><p class="font-medium mb-1">Important Notice</p><p>VentGPT provides supportive conversation but is not a replacement for professional mental health services. In crisis situations, please contact emergency services or the numbers above.</p></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ChatHeader.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "PersonalitySelector",
  __ssrInlineRender: true,
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const personalities = [
      {
        id: "supportive-friend",
        name: "Supportive Friend",
        description: "Warm, understanding, and encouraging like a close friend",
        approach: "Empathetic listening",
        tone: "Casual & caring",
        bgColor: "bg-gradient-to-br from-pink-500 to-rose-500",
        icon: UserGroupIcon,
        introduction: "I'm here to listen without judgment and offer the kind of support a good friend would. Let's talk about whatever's on your mind."
      },
      {
        id: "professional-counselor",
        name: "Professional Counselor",
        description: "Structured, therapeutic approach with gentle guidance",
        approach: "Solution-focused",
        tone: "Professional & warm",
        bgColor: "bg-gradient-to-br from-blue-500 to-indigo-500",
        icon: AcademicCapIcon,
        introduction: "I use evidence-based approaches to help you explore your thoughts and feelings. Together, we can work through what you're experiencing."
      },
      {
        id: "mindfulness-guide",
        name: "Mindfulness Guide",
        description: "Focus on present moment awareness and inner peace",
        approach: "Mindfulness-based",
        tone: "Calm & centered",
        bgColor: "bg-gradient-to-br from-green-500 to-emerald-500",
        icon: SparklesIcon,
        introduction: "Let's explore mindfulness and self-awareness together. I'll help you find moments of peace and clarity in your daily experience."
      },
      {
        id: "problem-solver",
        name: "Problem Solver",
        description: "Practical, action-oriented support for challenges",
        approach: "Solution-oriented",
        tone: "Direct & helpful",
        bgColor: "bg-gradient-to-br from-orange-500 to-amber-500",
        icon: LightBulbIcon,
        introduction: "I'm here to help you break down challenges into manageable steps. Let's work together to find practical solutions that work for you."
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto mb-8" }, _attrs))}><div class="text-center mb-6"><h2 class="text-2xl font-semibold text-gray-800 mb-2">Choose Your AI Companion</h2><p class="text-gray-600">Select a personality that feels right for you today</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><!--[-->`);
      ssrRenderList(personalities, (personality) => {
        _push(`<div class="personality-card group"><div class="text-center"><div class="${ssrRenderClass([personality.bgColor, "w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"])}">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(personality.icon), { class: "h-8 w-8 text-white" }, null), _parent);
        _push(`</div><h3 class="font-semibold text-gray-800 mb-2">${ssrInterpolate(personality.name)}</h3><p class="text-sm text-gray-600 mb-3">${ssrInterpolate(personality.description)}</p><div class="text-xs text-gray-500 space-y-1"><div class="flex items-center justify-center space-x-1"><span class="font-medium">Approach:</span><span>${ssrInterpolate(personality.approach)}</span></div><div class="flex items-center justify-center space-x-1"><span class="font-medium">Tone:</span><span>${ssrInterpolate(personality.tone)}</span></div></div></div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PersonalitySelector.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "ChatMessages",
  __ssrInlineRender: true,
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const messagesContainer = ref(null);
    const formatTime = (timestamp) => {
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(timestamp));
    };
    watch(() => props.messages.length, () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    });
    watch(() => props.isLoading, () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto mb-6" }, _attrs))}><div class="space-y-6"><!--[-->`);
      ssrRenderList(__props.messages, (message) => {
        _push(`<div class="${ssrRenderClass([message.role === "user" ? "justify-end" : "justify-start", "flex"])}"><div class="${ssrRenderClass([message.role, "chat-bubble"])}">`);
        if (message.role === "assistant") {
          _push(`<div class="flex items-start space-x-3"><div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">`);
          _push(ssrRenderComponent(unref(HeartIcon), { class: "h-5 w-5 text-white" }, null, _parent));
          _push(`</div><div class="flex-1"><div class="flex items-center space-x-2 mb-1"><span class="text-sm font-medium text-gray-700">VentGPT</span><span class="text-xs text-gray-500">${ssrInterpolate(formatTime(message.timestamp))}</span>`);
          if (message.isCrisis) {
            _push(`<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">`);
            _push(ssrRenderComponent(unref(ExclamationTriangleIcon), { class: "h-3 w-3 mr-1" }, null, _parent));
            _push(` Crisis Response </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="text-gray-800 leading-relaxed">${ssrInterpolate(message.content)} `);
          if (message.safetyIssues && message.safetyIssues.length > 0) {
            _push(`<div class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"><div class="flex items-start space-x-2">`);
            _push(ssrRenderComponent(unref(ExclamationTriangleIcon), { class: "h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" }, null, _parent));
            _push(`<div class="text-sm text-yellow-800"><p class="font-medium mb-1">Safety Notice:</p><ul class="text-xs space-y-1"><!--[-->`);
            ssrRenderList(message.safetyIssues, (issue) => {
              _push(`<li class="flex items-center space-x-1"><span class="w-1 h-1 bg-yellow-600 rounded-full"></span><span>${ssrInterpolate(issue)}</span></li>`);
            });
            _push(`<!--]--></ul></div></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        } else {
          _push(`<div class="text-right"><div class="flex items-center justify-end space-x-2 mb-1"><span class="text-xs text-blue-200">${ssrInterpolate(formatTime(message.timestamp))}</span><span class="text-sm font-medium text-blue-100">You</span></div><div class="leading-relaxed">${ssrInterpolate(message.content)}</div></div>`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]-->`);
      if (__props.isLoading) {
        _push(`<div class="flex justify-start"><div class="chat-bubble assistant"><div class="flex items-start space-x-3"><div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">`);
        _push(ssrRenderComponent(unref(HeartIcon), { class: "h-5 w-5 text-white" }, null, _parent));
        _push(`</div><div class="flex-1"><div class="flex items-center space-x-2 mb-1"><span class="text-sm font-medium text-gray-700">VentGPT</span><span class="text-xs text-gray-500">typing...</span></div><div class="flex space-x-1"><div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div><div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="${ssrRenderStyle({ "animation-delay": "0.1s" })}"></div><div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="${ssrRenderStyle({ "animation-delay": "0.2s" })}"></div></div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ChatMessages.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: "ChatInput",
  __ssrInlineRender: true,
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["send"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const message = ref("");
    ref(null);
    const canSend = computed(() => {
      return message.value.trim().length > 0 && message.value.length <= 1e3 && !props.disabled;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto" }, _attrs))}><div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-4"><div class="relative"><textarea${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""} placeholder="Share what&#39;s on your mind... (Press Shift+Enter for new line, Enter to send)" class="chat-input" rows="3">${ssrInterpolate(unref(message))}</textarea><button${ssrIncludeBooleanAttr(!unref(canSend)) ? " disabled" : ""} class="${ssrRenderClass([unref(canSend) ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm" : "bg-gray-200 text-gray-400 cursor-not-allowed", "absolute bottom-3 right-3 p-2 rounded-xl transition-all duration-200"])}">`);
      _push(ssrRenderComponent(unref(PaperAirplaneIcon), { class: "h-5 w-5" }, null, _parent));
      _push(`</button></div><div class="flex items-center justify-between mt-3 text-xs text-gray-500"><div class="flex items-center space-x-4"><span>💝 Completely confidential</span><span>🔒 No data stored</span><span>⚡ Real-time support</span></div><div class="flex items-center space-x-2"><span>${ssrInterpolate(unref(message).length)}/1000</span>`);
      if (unref(message).length > 0) {
        _push(`<button class="text-gray-400 hover:text-gray-600" title="Clear message">`);
        _push(ssrRenderComponent(unref(XMarkIcon), { class: "h-4 w-4" }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="text-center mt-4"><button class="inline-flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors">`);
      _push(ssrRenderComponent(unref(ExclamationTriangleIcon), { class: "h-4 w-4" }, null, _parent));
      _push(`<span>Need immediate help?</span></button></div></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ChatInput.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const useChat = () => {
  const isLoading = ref(false);
  const error = ref(null);
  const selectedPersonality = ref(null);
  const sendMessage = async (message, conversationHistory = []) => {
    if (!selectedPersonality.value) {
      error.value = "Please select a personality first";
      return null;
    }
    isLoading.value = true;
    error.value = null;
    try {
      console.log("Making API call to:", "/api/chat");
      console.log("Environment:", "production");
      const response = await $fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          message,
          personality: selectedPersonality.value,
          conversationHistory
        }
      });
      console.log("API Response received:", response);
      return response;
    } catch (err) {
      console.error("Chat API Error Details:", {
        error: err,
        status: err.status,
        statusCode: err.statusCode,
        statusMessage: err.statusMessage,
        data: err.data
      });
      if (err.status === 404 || err.statusCode === 404) {
        error.value = "API endpoint not found. Please check deployment.";
      } else if (err.statusCode === 400) {
        error.value = err.statusMessage || "Invalid request";
      } else if (err.statusCode === 500) {
        error.value = "Server error. Please try again.";
      } else {
        error.value = `Failed to send message: ${err.statusMessage || err.message || "Unknown error"}`;
      }
      return null;
    } finally {
      isLoading.value = false;
    }
  };
  const setPersonality = (personality) => {
    selectedPersonality.value = personality;
  };
  const clearError2 = () => {
    error.value = null;
  };
  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    selectedPersonality: readonly(selectedPersonality),
    sendMessage,
    setPersonality,
    clearError: clearError2
  };
};
const _sfc_main$2 = {
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const { sendMessage: sendChatMessage, isLoading, error, setPersonality } = useChat();
    const messages = ref([
      {
        id: 1,
        role: "assistant",
        content: "Hello! I'm here to listen and support you. How are you feeling today?",
        timestamp: /* @__PURE__ */ new Date()
      }
    ]);
    const hasConversation = computed(() => messages.value.length > 1);
    const selectPersonality = (personality) => {
      setPersonality(personality.id);
      messages.value.push({
        id: messages.value.length + 1,
        role: "assistant",
        content: `Hi! I'm your ${personality.name}. ${personality.introduction}`,
        timestamp: /* @__PURE__ */ new Date()
      });
    };
    const sendMessage = async (content) => {
      if (!content.trim()) return;
      const userMessage = {
        id: messages.value.length + 1,
        role: "user",
        content: content.trim(),
        timestamp: /* @__PURE__ */ new Date()
      };
      messages.value.push(userMessage);
      const conversationHistory = messages.value.map((msg) => ({
        role: msg.role,
        content: msg.content
      }));
      const response = await sendChatMessage(content.trim(), conversationHistory);
      if (response) {
        messages.value.push({
          id: messages.value.length + 1,
          role: "assistant",
          content: response.response,
          timestamp: /* @__PURE__ */ new Date(),
          isCrisis: response.isCrisis,
          safetyIssues: response.safetyIssues
        });
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$7, null, null, _parent));
      _push(`<div class="container mx-auto px-4 py-6">`);
      _push(ssrRenderComponent(_sfc_main$6, null, null, _parent));
      if (unref(error)) {
        _push(`<div class="max-w-4xl mx-auto mb-4"><div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800"><div class="flex items-center space-x-2">`);
        _push(ssrRenderComponent(unref(ExclamationTriangleIcon), { class: "h-5 w-5 text-red-600" }, null, _parent));
        _push(`<span class="font-medium">Error:</span><span>${ssrInterpolate(unref(error))}</span></div><button class="mt-2 text-sm text-red-600 hover:text-red-800 underline"> Dismiss </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(hasConversation)) {
        _push(ssrRenderComponent(_sfc_main$5, { onSelect: selectPersonality }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$4, {
        messages: unref(messages),
        "is-loading": unref(isLoading)
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, {
        onSend: sendMessage,
        disabled: unref(isLoading)
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-WxXxGzOh.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-rKWN9SPc.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { useNuxtApp as a, useRuntimeConfig as b, nuxtLinkDefaults as c, entry$1 as default, navigateTo as n, resolveRouteObject as r, useRouter as u };
//# sourceMappingURL=server.mjs.map
