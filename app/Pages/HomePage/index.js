/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * HomePage
 */

import React from 'react';
import { browserHistory } from 'react-router';
import Helmet from 'react-helmet';
import { githubData } from './fetch';

/* components */
import RepoListItem from 'Components/RepoListItem';
import Button from 'Components/Button';
import List from 'Components/List';
import ListItem from 'Components/ListItem';
import LoadingIndicator from 'Components/LoadingIndicator';

/* styles */
import styles from './styles.css';

class HomePage extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            username: '',
            loading: false,
            error: false,
            repos: false,
        };
    }

	onSubmitForm = (evt) => {
		if (evt !== undefined && evt.preventDefault) {
			evt.preventDefault();
		}

		this.setState({
			loading: true,
		});

		// 通过fetch请求数据。
		githubData(this.state.username, (data) => {
			this.setState({
				loading: false,
				repos: data,
			});
		}, () => {
			this.setState({
				loading: false,
				error: true,
			});
		});
	};

	onChangeUsername = (evt) => {
		this.setState({
			username: evt.target.value,
		});
	};

	openFeaturesPage = () => {
		browserHistory.push('/features');
	};

	render() {
		let mainContent = null;

		// loading的时候展示一个loading标识
		if (this.state.loading) {
			mainContent = (<List component={LoadingIndicator} />);
		// 展示存在的错误信息
		} else if (this.state.error) {
			const ErrorComponent = () => (
				<ListItem item={'发生了一些错误, 请再次尝试!'} />
			);
			mainContent = (<List component={ErrorComponent} />);
		// 一切正常并且返回了repos，则将它们展示出来
		} else if (this.state.repos) {
			mainContent = (<List items={this.state.repos} component={RepoListItem} />);
		}

		return (
			<article>
				<Helmet title="首页" />
				<div>
					<section className={styles['text-section']}>
						<h1>
							让我们开始吧!
						</h1>
					</section>
					<section className={`${styles['text-section']} ${styles.centered}`}>
						<h2 className={styles.background}></h2>
					</section>
					<section className={styles['text-section']}>
						<h2>
							尝试一下!
						</h2>
						<form className={styles['username-form']} onSubmit={this.onSubmitForm}>
							<label htmlFor="username">
								展示 <input
									id="username"
									className={styles.input}
									type="text"
									placeholder="帐户名"
									value={this.state.username}
									onChange={this.onChangeUsername}
								/> 的Github资源库
							</label>
						</form>
						{mainContent}
					</section>
					<Button handleRoute={this.openFeaturesPage}>下一页</Button>
				</div>
			</article>
		);
	}
}

export default HomePage;
