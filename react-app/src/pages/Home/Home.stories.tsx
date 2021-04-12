// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { themeDecorator } from '../../../.storybook/decorators'
import Component from './HomePage';

export default {
  title: 'HomePage',
  component: Component,
  decorators: [themeDecorator]
} as Meta;

const Template: Story<any> = (args) => <Component {...args} />;

export const HomePage = Template.bind({});
