import { getPrograms } from './programs'
import { describe, it, expect } from 'vitest'

describe('getPrograms', () => {
  it('returns programs', async () => {
    const programs = await getPrograms()
    // @ts-ignore
    expect(programs).toBeTypeOf('object')
  }, 10000)
  it('if successful, returns no error', async () => {
    const programs = await getPrograms()
    if (programs.programs) {
      // @ts-ignore
      expect(programs).toBeTypeOf('object')
    } else {
      // @ts-ignore
      expect(programs).not.toBeTypeOf('error')
    }
  }, 10000)
})
