import { writable } from 'svelte/store'
export const programs = writable([])
export const selectedProgram = writable(null)
export const programSelected = writable(false)

export const selectProgram = (
  /** @type {{nid:string,title:string}}*/ program
) => {
  // @ts-ignore
  selectedProgram.set(program)
  programSelected.set(true)
}

export const clearSelectedProgram = () => {
  selectedProgram.set(null)
  programSelected.set(false)
}
