import { Reactotron } from "reactotron-core-client"
import Realm ,{ Collection, CollectionChangeCallback, CollectionChangeSet } from "realm"
/* eslint-disable */
/* eslint-disable @typescript-eslint/no-unused-vars */
// --- Wall of imports ---------------------------------

// --- Helpers ---------------------------------

type ICommand = {
  type: string
  payload?: {
    paths: string[]
  }
}

// --- Interfaces ---------------------------------

interface TrackedRealm {
  /**
   * The node we are tracking.
   */
  realm: Realm
  /**
   * The mst model type
   */
  //   modelType: IType<any, any>
}

interface RealmTracker {
  [name: string]: TrackedRealm
}

const DEFAULT_KEY = "default"

export interface RealmPluginOptions {
  /**
   * When requesting keys, values, or subscribing, configures whether
   * we talk to the live state object (great for `volatile` state) or the
   * snapshot.  Defaults to `live`.
   */
  queryMode?: "live" | "snapshot"
}

// --- The Reactotron Plugin ---------------------------------

/**
 * A factory function for creating the plugin.
 *
 * @param opts Plugin options.
 */
export function realmPluginCreator(opts: RealmPluginOptions = {}) {
  /**
   * The mobx-state-tree Reactotron plugin.
   *
   * @param reactotron The reactotron instance we're attaching to.
   */
  function plugin(reactotron: Reactotron) {
    // --- Plugin-scoped variables ---------------------------------

    // the stores we're tracking
    const trackedRealms: RealmTracker = {}

    const listeners: {
      [key: string]: CollectionChangeCallback<unknown> | undefined
    } = {}

    // --- Connecting MST to Reactotron ---------------------------------

    /**
     * The entry point for integrating a mobx-state-tree node with Reactotron. Currently
     * one 1 root node is supported.
     *
     * @param realm The mobx-state-tree node to track
     * @param key The name to call it if we have more than 1.
     */
    function trackRealm(realm: Realm, key?: string) {
      // sanity
      if (!realm) {
        return { kind: "required" }
      }

      const _key = key ?? DEFAULT_KEY

      // prevent double tracking
      if (trackedRealms[_key]) {
        return { kind: "already-tracking" }
      }

      try {
        try {
          attachReactotronToRealm(realm, _key)
          // track this
          trackedRealms[_key] = { realm }
          //   console.log("Tracking realm", trackedRealms)

          return { kind: "ok" }
        } catch (e: any) {
          return { kind: "tracking-error", message: e?.message }
        }
      } catch (e) {
        return { kind: "invalid-realm" }
      }
    }

    /**
     * Connects a mst tree node to Reactotron.
     *
     * @param node The node we want to track.
     * @param nodeName What to call this node.
     */
    function attachReactotronToRealm(realm: Realm, key?: string) {
      // whenever the snapshot changes, send subscriptions
      //   onSnapshot(node, sendSubscriptions)
      //   realm.addListener()
      /**
       * Make some middleware that allows us to track actions.
       */
      //   addMiddleware(node, (call, next) => {
      //     // only actions for now
      //     const skip = call.type !== "action"
      //     // skip this middleware?
      //     if (skip) {
      //       return next(call)
      //     }
      //     // userland opt-out
      //     const shouldSend = mstFilter(call)
      //     if (!shouldSend) {
      //       return next(call)
      //     }
      //     // grab the arguments
      //     const args = convertUnsafeArguments(call.args)
      //     const path = getPath(call.context)
      //     // action related data
      //     const action = { args: args, name: call.name, path }
      //     // mst internal data
      //     const mstPayload = {
      //       id: call.id,
      //       parentId: call.parentId,
      //       rootId: call.rootId,
      //       type: call.type,
      //       modelType: getType(node),
      //       alive: isAlive(node),
      //       root: isRoot(node),
      //       protected: isProtected(node),
      //     }
      //     // start a timer
      //     const elapsed = reactotron.startTimer()
      //     // chain off to the next middleware
      //     const result = next(call)
      //     // measure the speed
      //     const ms = elapsed()
      //     // add nice display name
      //     const displayPath = replace(/^\./, "", replace(/\//g, ".", path))
      //     let name = replace(/^\./, "", `${nodeName ? nodeName : ""}${displayPath}.${call.name}()`)
      //     name = replace("/", ".", name)
      //     // fire this off to reactotron
      //     if (!restoring) {
      //       reactotron.send("state.action.complete", {
      //         name,
      //         action,
      //         mst: mstPayload,
      //         ms,
      //       })
      //     }
      //     // return the result of the next middlware
      //     return result
      //   })
    }

    // --- Reactotron Hooks ---------------------------------

    /**
     * A backup of state has been requested. Lets serialize the current
     * state and send it up to the app.
     *
     * @param command A reactotron command.
     */
    function backup(command: any) {
      //   const trackedNode = trackedRealms[command.mstNodeName || "default"]
      //   if (trackedNode && trackedNode.node) {
      //     const state = getSnapshot(trackedNode.node)
      //     reactotron.send("state.backup.response", { state })
      //   }
    }

    /**
     * Update the current state with one that was sent to us by the
     * Reactotron app.
     *
     * @param command A reactotron command.
     */
    function restore(command: any) {
      //   const trackedNode = trackedRealms[command.mstNodeName || "default"]
      //   const state = command && command.payload && command.payload.state
      //   if (trackedNode && trackedNode.node) {
      //     const { node } = trackedNode
      //     restoring = true
      //     applySnapshot(node, state)
      //     restoring = false
      //   }
    }

    /**
     * Applies an action to the mst node which was sent from the Reactotron
     * app. It can be a replayed action we emitted earlier, or one the user
     * has typed in manually.
     *
     * @param command A reactotron command.
     */
    function dispatchAction(command: any) {
      //   const trackedNode = trackedRealms[command.mstNodeName || "default"]
      //   const action = command && command.payload && command.payload.action
      //   if (trackedNode && trackedNode.node && action) {
      //     const { node } = trackedNode
      //     try {
      //       applyAction(node, action)
      //     } catch {
      //       // TODO: should we return a message?
      //     }
      //   }
    }

    /**
     * Subscribes to some paths in state. Allows the user to track a subset of
     * data within the state that will be sent to them every time it changes.
     *
     * @param command The command received from the reactotron app.
     */
    function subscribe<T = any>(command: ICommand) {
      const trackedRealm = trackedRealms[(command?.payload as any)?.realmKey || DEFAULT_KEY]
      //   console.log("trackedRealm", trackedRealm)

      const paths: string[] = (command && command.payload && command.payload.paths) ?? []
      //   console.log("paths", paths)

      if (paths?.length) {
        const realm = trackedRealm?.realm
        const availableSchemas = realm?.schema?.map((schema) => schema.name) ?? []

        const trackedPaths = Object.keys(listeners)

        const schemaNames = paths
          .filter((path) => {
            return path?.includes("REALM")
          })
          ?.map((path) => path?.split("REALM.")?.[1])
          ?.filter((schemaName) => availableSchemas?.includes(schemaName))

        const addSchemaNames = schemaNames?.filter(
          (schemaName) => !trackedPaths?.includes(schemaName),
        )
        const deleteSchemaNames = trackedPaths?.filter((s) => !schemaNames?.includes(s))

        // console.log("availableSchemas", availableSchemas)
        // console.log("trackedPaths", trackedPaths)
        // console.log("schemaNames", schemaNames)
        // console.log("addSchemaNames", addSchemaNames)
        // console.log("deleteSchemaNames", deleteSchemaNames)

        addSchemaNames.forEach((schema) => {
          if (realm && !listeners?.[schema]) {
            const listener: CollectionChangeCallback<T> = (
              collection: Collection<T>,
              changes: CollectionChangeSet,
            ) => {
              const clone = Array.from(collection)
              // const _changes = [
              //   {
              //     path: `REALM.${schema}`,
              //     value: clone,
              //   },
              // ]
              //   reactotron?.stateValuesChange?.(_changes)
              reactotron?.logImportant?.(`REALM.${schema}`, clone)
            }
            try {
              realm.objects<T>(schema).addListener(listener)
              ;(listeners as any)[schema] = listener
            } catch (error) {
              console.log("error", error)
            }
          }
        })

        deleteSchemaNames.forEach((schema) => {
          if (realm && listeners[schema]) {
            const listener = listeners[schema]
            try {
              realm.objects<T>(schema).removeListener(listener as any)
              delete listeners[schema]
            } catch (error) {
              console.log("error", error)
            }
          }
        })
      }
    }

    /**
     * Given a path somewhere within the tree, list the keys found if it is an object.
     *
     * @param command The command received from the reactotron app.
     */
    function requestKeys(command: any) {
      //   const trackedNode = trackedRealms[command.mstNodeName || "default"]
      //   const atPath: string = (command && command.payload && command.payload.path) || []
      //   if (trackedNode && trackedNode.node && atPath) {
      //     const state = getSnapshot(trackedNode.node)
      //     if (isNilOrEmpty(atPath)) {
      //       reactotron.stateKeysResponse(null, keys(state))
      //     } else {
      //       const keyList = keys(dotPath(atPath, state))
      //       reactotron.stateKeysResponse(atPath, keyList)
      //     }
      //   }
    }

    /**
     * Gets the current value located at the path within the state tree.
     *
     * @param command The command received from the reactotron app.
     */
    function requestValues(command: any) {
      //   const trackedNode = trackedRealms[command.mstNodeName || "default"]
      //   const atPath: string = (command && command.payload && command.payload.path) || []
      //   if (trackedNode && trackedNode.node && atPath) {
      //     const state = getSnapshot(trackedNode.node)
      //     if (isNilOrEmpty(atPath)) {
      //       reactotron.stateValuesResponse(null, state)
      //     } else {
      //       reactotron.stateValuesResponse(atPath, dotPath(atPath, state))
      //     }
      //   }
    }

    // --- Reactotron Hooks ---------------------------------

    // maps inbound commands to functions to run
    const COMMAND_MAP: { [name: string]: (command: any) => void } = {
      "state.backup.request": backup,
      "state.restore.request": restore,
      "state.action.dispatch": dispatchAction,
      "state.values.subscribe": subscribe,
      "state.keys.request": requestKeys,
      "state.values.request": requestValues,
    }

    /**
     * Fires when we receive a command from the reactotron app.
     */
    function onCommand(command: any) {
      // lookup the command and execute
      const handler = COMMAND_MAP[command && command.type]
      handler && handler(command)
    }

    // --- Reactotron plugin interface ---------------------------------

    return {
      // Fires when we receive a command from the Reactotron app.
      onCommand,

      // All keys in this object will be attached to the main Reactotron instance
      // and available to be called directly.
      features: { trackRealm },
    }
  }

  return plugin
}

declare module "reactotron-core-client" {
  // eslint-disable-next-line import/export
  export interface Reactotron {
    trackRealm?: (realm: Realm) => { kind: string; message?: string }
  }
}
