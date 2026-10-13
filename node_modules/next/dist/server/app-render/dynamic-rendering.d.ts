/**
 * The functions provided by this module are used to communicate certain properties
 * about the currently running code so that Next.js can make decisions on how to handle
 * the current execution in different rendering modes such as pre-rendering, resuming, and SSR.
 *
 * Today Next.js treats all code as potentially static. Certain APIs may only make sense when dynamically rendering.
 * Traditionally this meant deopting the entire render to dynamic however with PPR we can now deopt parts
 * of a React tree as dynamic while still keeping other parts static. There are really two different kinds of
 * Dynamic indications.
 *
 * The first is simply an intention to be dynamic. unstable_noStore is an example of this where
 * the currently executing code simply declares that the current scope is dynamic but if you use it
 * inside unstable_cache it can still be cached. This type of indication can be removed if we ever
 * make the default dynamic to begin with because the only way you would ever be static is inside
 * a cache scope which this indication does not affect.
 *
 * The second is an indication that a dynamic data source was read. This is a stronger form of dynamic
 * because it means that it is inappropriate to cache this at all. using a dynamic data source inside
 * unstable_cache should error. If you want to use some dynamic data inside unstable_cache you should
 * read that data outside the cache and pass it in as an argument to the cached function.
 */
import type { WorkStore } from './work-async-storage.external';
import type { WorkUnitStore, PrerenderStoreModern, ValidationStoreClient, PrerenderStoreModernServer } from './work-unit-async-storage.external';
import { type ValidationBoundaryTracking } from './instant-validation/boundary-tracking';
import type { InstantValidationSampleTracking } from './instant-validation/instant-samples';
export type DynamicAccess = {
    /**
     * If debugging, this will contain the stack trace of where the dynamic access
     * occurred. This is used to provide more information to the user about why
     * their page is being rendered dynamically.
     */
    stack?: string;
    /**
     * The expression that was accessed dynamically.
     */
    expression: string;
};
export type DynamicTrackingState = {
    /**
     * When true, stack information will also be tracked during dynamic access.
     */
    readonly isDebugDynamicAccesses: boolean | undefined;
    /**
     * The dynamic accesses that occurred during the render.
     */
    readonly dynamicAccesses: Array<DynamicAccess>;
    syncDynamicErrorWithStack: null | Error;
    syncDynamicErrorWithStackPostMicrotask: boolean;
};
export type DynamicValidationState = {
    hasSuspenseAboveBody: boolean;
    hasDynamicMetadata: boolean;
    dynamicMetadata: null | Error;
    hasDynamicViewport: boolean;
    hasAllowedDynamic: boolean;
    dynamicErrors: Array<Error>;
};
export declare function createDynamicTrackingState(isDebugDynamicAccesses: boolean | undefined): DynamicTrackingState;
export declare function createDynamicValidationState(): DynamicValidationState;
export declare function getFirstDynamicReason(trackingState: DynamicTrackingState): undefined | string;
/**
 * This function communicates that the current scope should be treated as dynamic.
 *
 * In most cases this function is a no-op but if called during
 * a PPR prerender it will postpone the current sub-tree and calling
 * it during a normal prerender will cause the entire prerender to abort
 */
export declare function markCurrentScopeAsDynamic(store: WorkStore, workUnitStore: undefined | Exclude<WorkUnitStore, PrerenderStoreModern>, expression: string): void;
export declare function abortOnSynchronousPlatformIOAccess(route: string, expression: string, errorWithStack: Error, prerenderStore: PrerenderStoreModern): void;
type DigestError = Error & {
    digest: string;
};
export declare function isPrerenderInterruptedError(error: unknown): error is DigestError;
export declare function accessedDynamicData(dynamicAccesses: Array<DynamicAccess>): boolean;
export declare function consumeDynamicAccess(serverDynamic: DynamicTrackingState, clientDynamic: DynamicTrackingState): DynamicTrackingState['dynamicAccesses'];
export declare function formatDynamicAPIAccesses(dynamicAccesses: Array<DynamicAccess>): string[];
/**
 * In a prerender, we may end up with hanging Promises as inputs due them
 * stalling on connection() or because they're loading dynamic data. In that
 * case we need to abort the encoding of arguments since they'll never complete.
 */
export declare function createHangingInputAbortSignal(workUnitStore: PrerenderStoreModernServer): AbortSignal;
export declare function createHangingInputAbortSignal(workUnitStore: WorkUnitStore): AbortSignal | undefined;
export declare function annotateDynamicAccess(expression: string, prerenderStore: PrerenderStoreModern | ValidationStoreClient): void;
export declare function trackDynamicAccessInStaticRoute(dynamicReason: unknown, workStore: WorkStore, componentStack: string, dynamicValidation: DynamicValidationState, clientDynamic: DynamicTrackingState, isServerPartial: boolean, kind: StaticValidationHoleKind): void;
export declare function trackAllowedDynamicAccess(dynamicReason: unknown, workStore: WorkStore, componentStack: string, dynamicValidation: DynamicValidationState, clientDynamic: DynamicTrackingState): void;
export declare enum DynamicHoleKind {
    /** We know that this hole is caused by runtime data. */
    Runtime = 1,
    /** We know that this hole is caused by link data. */
    Link = 2,
    /** We know that this hole is caused by navigation(). */
    Navigation = 3,
    /** We know that this hole is caused by prefetch(). */
    Prefetch = 4,
    /** We know that this hole is caused by dynamic data. */
    Dynamic = 5,
    /** We know that this hole is caused by runtime or dynamic data, but don't know which. */
    RuntimeOrDynamic = 6
}
export type InstantValidationHoleKind = Exclude<DynamicHoleKind, DynamicHoleKind.RuntimeOrDynamic>;
export type StaticValidationHoleKind = DynamicHoleKind.Runtime | DynamicHoleKind.Dynamic | DynamicHoleKind.RuntimeOrDynamic;
/** Stores dynamic reasons used during an SSR render in instant validation. */
export type InstantValidationState = {
    hasDynamicMetadata: boolean;
    hasAllowedClientDynamicAboveBoundary: boolean;
    dynamicMetadata: null | Error;
    hasDynamicViewport: boolean;
    hasAllowedDynamic: boolean;
    dynamicErrors: Array<Error>;
    validationPreventingErrors: Array<Error>;
    thrownErrorsOutsideBoundary: Array<unknown>;
    /** Per-slot config factories. Index 0 is the root config (fallback).
     * Indices 1+ correspond to slot marker components in the tree. */
    slotStacks: Array<(() => Error) | null>;
};
export declare function createInstantValidationState(slotStacks: Array<(() => Error) | null>): InstantValidationState;
export declare function trackDynamicHoleInNavigation(dynamicReason: unknown, workStore: WorkStore, componentStack: string, dynamicValidation: InstantValidationState, clientDynamic: DynamicTrackingState, kind: InstantValidationHoleKind, boundaryState: ValidationBoundaryTracking): void;
export declare function trackThrownErrorInNavigation(workStore: WorkStore, dynamicValidation: InstantValidationState, thrownValue: unknown, componentStack: string, reactBrowserBailout: boolean): void;
export declare function trackDynamicHoleInStaticShell(dynamicReason: unknown, workStore: WorkStore, componentStack: string, dynamicValidation: DynamicValidationState, clientDynamic: DynamicTrackingState, kind: DynamicHoleKind.Runtime | DynamicHoleKind.Dynamic): void;
export declare enum PreludeState {
    Full = 0,
    Empty = 1,
    Errored = 2
}
export declare function logDisallowedDynamicError(workStore: WorkStore, error: Error): void;
export declare function throwIfSyncIOUsed(workStore: WorkStore, serverDynamic: DynamicTrackingState): void;
export declare function throwIfDisallowedDynamic(workStore: WorkStore, prelude: PreludeState, dynamicValidation: DynamicValidationState, serverDynamic: DynamicTrackingState, allowEmptyStaticShell: boolean): void;
export declare function throwIfDisallowedDynamicInStaticRoute(workStore: WorkStore, prelude: PreludeState, dynamicValidation: DynamicValidationState, serverDynamic: DynamicTrackingState, isFallbackShell: boolean, allowEmptyStaticShell: boolean, isServerPartial: boolean): void;
export declare function getDisallowedReasonsInStaticRoute(workStore: WorkStore, prelude: PreludeState, dynamicValidation: DynamicValidationState, serverDynamic: DynamicTrackingState | null, isFallbackShell: boolean, allowEmptyStaticShell: boolean, isServerPartial: boolean): Error[];
export declare function getStaticShellDisallowedDynamicReasons(workStore: WorkStore, prelude: PreludeState, dynamicValidation: DynamicValidationState, allowEmptyStaticShell: boolean): Array<Error>;
/**
 * `errors` are validation failures that should be surfaced immediately.
 * `deferredFallback` carries a missing-boundary explanation that the caller
 * should hold back until *every* validation depth has been tried — a missing
 * boundary often just means a parent layout intentionally omitted a slot, and
 * a different depth's validation may surface a more meaningful error.
 */
export type NavigationValidationResult = Array<Error> | Error | AggregateError;
export declare function getNavigationDisallowedDynamicReasons(workStore: WorkStore, prelude: PreludeState, dynamicValidation: InstantValidationState, validationSampleTracking: InstantValidationSampleTracking | null, boundaryState: ValidationBoundaryTracking, devRenderDidError: boolean): NavigationValidationResult;
export {};
