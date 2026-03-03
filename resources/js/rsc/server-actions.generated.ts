"use server";
// @generated — do not edit. Auto-discovered from app/Rsc/Actions/

export async function todoActionsAdd(...args: unknown[]) {
  return await (globalThis as any).php("TodoActions.add", ...args);
}

export async function todoActionsToggle(...args: unknown[]) {
  return await (globalThis as any).php("TodoActions.toggle", ...args);
}

export async function todoActionsDelete(...args: unknown[]) {
  return await (globalThis as any).php("TodoActions.delete", ...args);
}
