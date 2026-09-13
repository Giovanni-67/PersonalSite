import test from 'node:test'
import assert from 'node:assert/strict'
import { projects, courses } from '../src/data/portfolio.js'

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

test('coursework follows the confirmed newest-first sequence with correct prefixes', () => {
  assert.deepEqual(courses.map(course => course.code), ['CSC 2001', 'CSC 1000', 'CIT 230', 'CS 202', 'CIT 130', 'CIT 260', 'CIT 180', 'CIT 129', 'AP CS A'])
  assert.equal(new Set(courses.map(course => course.code)).size, courses.length)
  for (const course of courses) {
    assert.ok(course.title.trim())
    assert.ok(course.summary.trim())
  }
})

test('project descriptions reflect the confirmed contributions', () => {
  const minecraft = JSON.stringify(projects.find(project => project.variant === 'minecraft'))
  assert.match(minecraft, /\/discord/)
  assert.doesNotMatch(minecraft, /\/ping|\/ms|latency|Online-player lookup/)
  for (const change of ['two Chemist health potions', '20–25', '25–30', '30–35', '35+', 'Heavy Speed I', 'resistance and regeneration']) {
    assert.ok(minecraft.includes(change), change)
  }
  const exam = JSON.stringify(projects.find(project => project.variant === 'exam'))
  for (const detail of ['instructor/admin', 'student', 'frontend', 'Flask backend', 'MySQL', 'Waterfall', 'Agile']) {
    assert.ok(exam.includes(detail), detail)
  }
})
