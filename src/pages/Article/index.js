import React, {PureComponent} from 'react'

import {withRouter,Route,NavLink,Switch} from 'react-router-dom'
import Bundle from '@modules/Bundle'

import ListC from 'bundle-loader?lazy&name=app-list!./List';
const List = Bundle(ListC)

import List2C from 'bundle-loader?lazy&name=app-list2!./List2';
const List2 = Bundle(List2C)

import {createStore, applyMiddleware, compose} from '@modules/redux'
import PropTypes from 'prop-types';

import thunk from 'redux-thunk'

// import logger from 'redux-logger'

const logger = (store) => (next) => (action) =>{
    console.log('第二个中间件',next)
    console.group(action.type)
    console.info('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
      console.groupEnd(action.type)
     return result
}
const timeDelay = (store) => (next) => (action) =>{
    console.log('第一个中间件',next)
    if(action && action.delay === undefined) {
        return next(action)
    }
    let st = setTimeout(()=>{
        console.log(action.delay/1000,'后执行减1')
        return next(action)
    },action.delay)
}

function reducer(state = {}, action) {
  switch (action.type) {
    case 'add':
      state.data1 = state.data1 + action.data;
      return state;
    case 'incre':
       state.data1 = state.data1 - action.data;
      return state;
    default:
      return state
  }
  return action;
}

let store = createStore(reducer,{data1:0},compose(
    // 此处先延时2秒，2秒后减少1后，才会执行logger中间件，如果logger中间件在前，那么先logger，两秒后才会减1。thunk中间件如果放在前面，那么dispatch一个function时，thunk后面的中间件在本次dispatch过程中将不会被执行，所以最好thunk放在最后
    applyMiddleware(timeDelay,logger,thunk),
))
console.log(store)

class Article extends PureComponent {
	constructor(props) {
        super(props);
    }

	getChildContext(){
		return {
			store:store
		}
	}

    componentDidMount(){
    }

	render() {
        const { match } = this.props;
		return (
		<section>
			<Route path={`${match.url}`} exact component={List} />
			<Route path={`${match.url}/list`} component={List} />
			<Route path={`${match.url}/list2`} component={List2} />
		</section>)
	}
}
Article.childContextTypes = {
	store:PropTypes.object,
};

export default withRouter(Article)
