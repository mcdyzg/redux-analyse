import React, {PureComponent} from 'react'
import './List.scss'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';


class List extends PureComponent {

	state = {
		name:'list1'
	}
	constructor(props,context) {
        super(props,context);
    }
	componentDidMount(){
		let store = this.context.store
		this.updateStore()
		this.unsubscribe = store.subscribe(()=>{
			console.log('list1 触发回调')
			this.updateStore()
		})
	}

	updateStore=()=>{
		let store = this.context.store
		this.setState({
			...this.state,
			...store.getState(),
		})
	}

	componentWillUnmount(){
		console.log('list1 消失')
		this.unsubscribe()
	}

	render() {
		return (
		<div className=''>

			<div>
			    我是本身的state:  {this.state.name}
			</div>
			<div>
			    我是store中的data1: {this.state.data1}
			</div>
			<div onClick={()=>this.context.store.dispatch({
				type:'add',
				data:1,
			})}>
				加一
			</div>
			<div onClick={()=>this.setState({name:'改过名的 list1'})}>
				本身state改名
			</div>
		</div>)
	}
}
List.contextTypes = {
	store:PropTypes.object,
}

export default withRouter(List)
