import test from 'node:test'
import assert from 'node:assert/strict'
import { projects } from '../src/data/portfolio.js'

test('projects follow the requested five-project sequence without placeholders', () => {
  assert.deepEqual(projects.map(project => project.variant), ['exam', 'minecraft', 'slo', 'trading', 'redis'])
  assert.equal(new Set(projects.map(project => project.title)).size, projects.length)
})

test('in-progress projects are clearly labeled and trading uses plain language', () => {
  for (const variant of ['slo', 'trading', 'redis']) {
    assert.equal(projects.find(project => project.variant === variant).status, 'Currently Building')
  }
  const trading = projects.find(project => project.variant === 'trading')
  assert.equal(trading.title, 'Trading Strategy Lab')
  assert.doesNotMatch(JSON.stringify(trading), /quant/i)
  assert.match(trading.description, /no live trading/)
})

test('every card has complete, nonempty display content and unique details', () => {
  for (const project of projects) {
    for (const key of ['title', 'variant', 'description']) {
      assert.equal(typeof project[key], 'string')
      assert.ok(project[key].trim())
    }
    for (const key of ['stack', 'details']) {
      assert.ok(Array.isArray(project[key]) && project[key].length > 0)
      assert.equal(new Set(project[key]).size, project[key].length)
      assert.ok(project[key].every(value => typeof value === 'string' && value.trim()))
    }
  }
})
