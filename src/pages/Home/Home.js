import React, {PureComponent} from 'react'
import {HashRouter, Route, Switch, Link,Redirect} from 'react-router-dom'
import './Home.scss'
import Article from '@pages/Article'



class Home extends PureComponent {
	constructor(props) {
        super(props);
		this.state = {
		}
    }

	render() {
		return (
		<div>
			头部{this.state.a}
			<HashRouter>
				{/* 内容区域 */}
				<section className="">
					<Route path="/article" component={Article} />
				</section>
		    </HashRouter>
		</div>
		)
	}
}

export default Home
