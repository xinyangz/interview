import React from 'react';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import {RedirectPage} from './RedirectPage';
import jsdom from 'mocha-jsdom';

describe('<RedirectPage />', () => {
  const loginFunc = sinon.spy();
  const pushFunc = sinon.spy();
  const redirectText = '跳转中...';

  jsdom();

  it('should render redirect text', () => {
    const wrapper = shallow(<RedirectPage login={loginFunc} push={pushFunc}/>);
    const text = wrapper.find('p').childAt(0).text();
    expect(text).to.be.equal(redirectText);
  });

  it('should call login function if query parameters provided', () => {
    const location = {query: {n: '123', p: '123'}};
    const wrapper = mount(<RedirectPage login={loginFunc} push={pushFunc} location={location}/>);
    expect(loginFunc.called).to.be.true;
  });

  it('should redirect to not-found page if query parameters are not satisfied', () => {
    const location = {query: {foo: '123'}};
    const wrapper = mount(<RedirectPage login={loginFunc} push={pushFunc} location={location}/>);
    expect(pushFunc.calledWith('/not-found')).to.be.true;
  })
});
