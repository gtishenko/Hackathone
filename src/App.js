import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {goBack, closeModal} from "./js/store/router/actions";
import {getActivePanel} from "./js/services/_functions";
import * as VK from './js/services/VK';
import bridge from '@vkontakte/vk-bridge'
import {setColorScheme} from "./js/store/vk/actions";

import {View, Root, ModalRoot, ConfigProvider} from "@vkontakte/vkui";

import HomePanelBase from './js/panels/home/base';
import HomePanelGroups from './js/panels/home/groups';
import HomePanelSelectCity from './js/panels/home/selectCity';
import HomePanelSelectAddress from './js/panels/home/selectAddress';
import HomePanelCreateChat from './js/panels/home/createChat';
import HomePanelSettings from './js/panels/home/settings';
import HomePanelUsers from './js/panels/home/users';

import HomeBotsListModal from './js/components/modals/HomeBotsListModal';
import HomeBotInfoModal from './js/components/modals/HomeBotInfoModal';

import MorePanelExample from './js/panels/more/example';

var City, CityID;

class App extends React.Component {
    constructor(props) {
        super(props);

        this.lastAndroidBackAction = 0;
    }

    componentDidMount() {
        const {goBack, dispatch} = this.props;

        dispatch(VK.initApp());

        bridge.subscribe((e) => {
            switch (e.detail.type) {
                case 'VKWebAppGetUserInfoResult':
                    if(e.detail.data.country.id == 1) {
                        City = e.detail.data.city.title;
                        CityID = e.detail.data.city.id;
                    } else {
                        City = '';
                        CityID = '';
                    }
                    console.log(City + ' ' + CityID);
                    break;
                case 'VKWebAppUpdateConfig':
                    dispatch(setColorScheme(e.detail.data.scheme));
                    if(e.detail.data.scheme == 'bright_light') {
                       bridge.send('VKWebAppSetViewSettings', {
                               'status_bar_style': 'dark',
                               'action_bar_color': '#fff'
                         });
                     }
                     else {
                       bridge.send('VKWebAppSetViewSettings', {
                               'status_bar_style': 'light',
                               'action_bar_color': '#191919'
                         });
                     }
                    break;
 
            }
         });

         bridge.send("VKWebAppGetUserInfo");

        window.onpopstate = () => {
            let timeNow = +new Date();

            if (timeNow - this.lastAndroidBackAction > 500) {
                this.lastAndroidBackAction = timeNow;

                goBack();
            } else {
                window.history.pushState(null, null);
            }
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {activeView, activeStory, activePanel, scrollPosition} = this.props;

        if (
            prevProps.activeView !== activeView ||
            prevProps.activePanel !== activePanel ||
            prevProps.activeStory !== activeStory
        ) {
            let pageScrollPosition = scrollPosition[activeStory + "_" + activeView + "_" + activePanel] || 0;

            window.scroll(0, pageScrollPosition);
        }
    }

    render() {
        const {goBack, closeModal, popouts, activeView, activeModals, panelsHistory, colorScheme} = this.props;

        let history = (panelsHistory[activeView] === undefined) ? [activeView] : panelsHistory[activeView];
        let popout = (popouts[activeView] === undefined) ? null : popouts[activeView];
        let activeModal = (activeModals[activeView] === undefined) ? null : activeModals[activeView];

        const homeModals = (
            <ModalRoot activeModal={activeModal}>
                <HomeBotsListModal
                    id="MODAL_PAGE_BOTS_LIST"
                    onClose={() => closeModal()}
                />
                <HomeBotInfoModal
                    id="MODAL_PAGE_BOT_INFO"
                    onClose={() => closeModal()}
                />
            </ModalRoot>
        );

        return (
            <ConfigProvider isWebView={true} scheme={colorScheme}>
                <Root activeView={activeView} popout={popout}>
                    <View
                        id="home"
                        modal={homeModals}
                        activePanel={getActivePanel("home")}
                        history={history}
                        onSwipeBack={() => goBack()}
                    >
                        <HomePanelBase id="base" withoutEpic={false}/>
                        <HomePanelGroups id="groups"/>
                        <HomePanelCreateChat id="createChat"/>
                        <HomePanelSettings id="settings"/>
                        <HomePanelSelectCity id="selectCity"/>
                        <HomePanelSelectAddress id="selectAddress"/>
                        <HomePanelUsers id="users"/>
                    </View>
                    <View
                        id="modal"
                        modal={homeModals}
                        activePanel={getActivePanel("modal")}
                        history={history}
                        onSwipeBack={() => goBack()}
                    >
                        <MorePanelExample id="filters"/>
                    </View>
                </Root>
            </ConfigProvider>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        activeView: state.router.activeView,
        activeStory: state.router.activeStory,
        panelsHistory: state.router.panelsHistory,
        activeModals: state.router.activeModals,
        popouts: state.router.popouts,
        scrollPosition: state.router.scrollPosition,

        colorScheme: state.vkui.colorScheme
    };
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({goBack, closeModal}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
export var City;
export var CityID;