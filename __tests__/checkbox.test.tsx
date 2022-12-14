import { render } from '@testing-library/react';
import React from 'react';
import {
  ReqoreCheckbox,
  ReqoreContent,
  ReqoreLayoutContent,
  ReqoreUIProvider,
} from '../src';

test('Renders <Checkbox /> properly', () => {
  render(
    <ReqoreUIProvider>
      <ReqoreLayoutContent>
        <ReqoreContent>
          <ReqoreCheckbox />
          <ReqoreCheckbox size='small' />
          <ReqoreCheckbox size='big' />
          <ReqoreCheckbox disabled />
          <ReqoreCheckbox
            label='Right'
            labelDetail={<p className='label-detail'></p>}
          />
          <ReqoreCheckbox label='Left' />
          <ReqoreCheckbox label='Right' asSwitch />
        </ReqoreContent>
      </ReqoreLayoutContent>
    </ReqoreUIProvider>
  );

  expect(document.querySelectorAll('.reqore-checkbox').length).toBe(7);
  expect(document.querySelectorAll('.label-detail').length).toBe(1);
});
