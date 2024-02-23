// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react'
import Spinner from './Spinner';
import { render, screen } from '@testing-library/react';

test('sanity', () => {
  expect(true).toBe(true)
})
describe('spinner render tests', () => {
  
  test('spinner renders when passed true value', () => {
    render(<Spinner on={true}/>)
    screen.debug()
    expect(screen.queryByText('Please wait...')).not.toBeNull()
  })
  test('spinner does not render when passed a false value', () => {
    render(<Spinner on={false} />)
    screen.debug()
    expect(screen.queryByText('Please wait...')).toBeNull();
  })
})
