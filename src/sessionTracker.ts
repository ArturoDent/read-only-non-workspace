
// export let readOnlyMap: Map<string, boolean>;
let readOnlyMap: Map<string, boolean>;

export async function initialize(): Promise<Map<string, boolean>>  {
  
  // a sessionID: 5a72d90-2bf7-4c14-9fa0-277c625687261717798124729
  // module.exports.readOnlyMap = new Map<string, boolean>();
  readOnlyMap = new Map<string, boolean>();
  // return module.exports.readOnlyMap;
  return readOnlyMap;
}

export function hasFile(fsPath: string): boolean {
  // return module.exports.readOnlyMap.has(fsPath);
  return readOnlyMap.has(fsPath);
}

export function addFile(fsPath: string, state: boolean): void {
  // module.exports.readOnlyMap.set(fsPath, state);
  readOnlyMap.set(fsPath, state);
}

// returns undefined if not in Map, else the boolean state
export function getFile(fsPath: string): boolean | undefined {
  // return  module.exports.readOnlyMap.get(fsPath);
  return  readOnlyMap.get(fsPath);
}

export function toggleMapStatus(fsPath: string): void {
  // if ( module.exports.readOnlyMap.get(fsPath)) module.exports.readOnlyMap.set(fsPath, false);
  if ( readOnlyMap.get(fsPath)) readOnlyMap.set(fsPath, false);
  // else  module.exports.readOnlyMap.set(fsPath, true);  // undefined and false
  else  readOnlyMap.set(fsPath, true);  // undefined and false
}
