import test from 'node:test'
import assert from 'node:assert/strict'
import { skills } from '../src/data/portfolio.js'

test('skills use topic groups rather than implied proficiency tiers', () => {
  assert.deepEqual(skills.map(group => group.label), [
    'Programming & web languages', 'Frameworks & technologies',
    'Tools & environments', 'Areas of interest', 'Spoken languages',
  ])
  assert.doesNotMatch(JSON.stringify(skills), /concepts explored|currently expanding|binary trees|TCP sockets|multithreading|race conditions/i)
  const interests = skills.find(group => group.label === 'Areas of interest').items
  for (const area of ['Frontend development', 'UI design and interaction', 'Backend development']) {
    assert.ok(interests.includes(area), area)
  }
})

test('bilingual fluency is separate from programming languages', () => {
  assert.deepEqual(skills.find(group => group.label === 'Spoken languages').items, ['English (fluent)', 'Mandarin (fluent)'])
  assert.deepEqual(skills.find(group => group.label === 'Programming & web languages').items, ['Java', 'Python', 'C++', 'JavaScript', 'HTML', 'CSS'])
})

test('skill groups have unique labels and nonempty, unique items', () => {
  assert.equal(new Set(skills.map(group => group.label)).size, skills.length)
  for (const group of skills) {
    assert.ok(group.items.length > 0)
    assert.ok(group.items.every(item => typeof item === 'string' && item.trim()))
    assert.equal(new Set(group.items).size, group.items.length)
  }
})
