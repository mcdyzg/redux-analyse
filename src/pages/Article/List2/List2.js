import React, {PureComponent} from 'react'
import './List2.scss'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';


class List2 extends PureComponent {

	state = {
		name:'list2'
	}
	constructor(props) {
        super(props);
    }

	componentDidMount(){
		let store = this.context.store
		this.updateStore()
		this.unsubscribe = store.subscribe(()=>{
			console.log('list2 触发回调')
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
		console.log('list2 消失')
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
				type:'incre',
				data:1,
			})}>
				减一
			</div>

			<div onClick={()=>this.context.store.dispatch({
				type:'incre',
				data:1,
				delay:2000,
			})}>
				定时2秒后减一
			</div>

			<div onClick={()=>{
				let asyncActon = (name) => (dispatch, getState) =>{
					return fetch(`https://api.github.com/search/users?q=${name}`)
		            .then(res=>res.json())
					.then(res=>{
						console.log(dispatch)
					})
					.then(res=>{
						dispatch({
							type:'incre',
							data:1,
						})
					})
				}

				this.context.store.dispatch(asyncActon('mcdyzg')).then(res=>{
					console.log(res)
				})
			}}>
				异步action,thunk实现
			</div>

			<div onClick={()=>this.setState({name:'改过名的 list2'})}>
				本身state改名
			</div>

			<div onClick={()=>{
				this.unsubscribe()
			}}>
			    解除绑定
			</div>
		</div>)
	}
}
List2.contextTypes = {
	store:PropTypes.object,
}

export default withRouter(List2)
