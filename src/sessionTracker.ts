
let readOnlyMap: Map<string, boolean>;

export async function initialize(): Promise<Map<string, boolean>>  {
  
  // a sessionID: 5a72d90-2bf7-4c14-9fa0-277c625687261717798124729
  readOnlyMap = new Map<string, boolean>();
  return readOnlyMap;
}

export function hasFile(fsPath: string): boolean {
  return readOnlyMap.has(fsPath);
}

export function addFile(fsPath: string, state: boolean): void {
  readOnlyMap.set(fsPath, state);
}

// returns undefined if not in Map, else the boolean state
export function getFile(fsPath: string): boolean | undefined {
  return  readOnlyMap.get(fsPath);
}

export function toggleMapStatus(fsPath: string): void {
  if ( readOnlyMap.get(fsPath)) readOnlyMap.set(fsPath, false);
  else  readOnlyMap.set(fsPath, true);  // undefined and false
}
