import { it, expect } from 'vitest'
import titleCase from './titleCase.js'

it('Correctly title cases a given string', () => {
  expect(titleCase('hello world')).toBe('Hello World')
  expect(titleCase('hello World')).toBe('Hello World')
  expect(titleCase('hello. world.')).toBe('Hello. World.')
  expect(titleCase('hello-world')).toBe('Hello-World')
  expect(titleCase('hello_world')).toBe('Hello_World')
})

it('Correctly ignores anything inside of brackets', () => {
  expect(titleCase('tim cook (ceo)')).toBe('Tim Cook (ceo)')
  expect(titleCase('tim-cook (ceo)')).toBe('Tim-Cook (ceo)')
  expect(titleCase('tim_cook (ceo)')).toBe('Tim_Cook (ceo)')
  expect(titleCase("I'm a little teapot (and you're not)")).toBe(
    "I'm A Little Teapot (and you're not)"
  )
  expect(titleCase('abc 123. this-is-a-test. (CEO)')).toBe(
    'Abc 123. This-Is-A-Test. (CEO)'
  )
})
