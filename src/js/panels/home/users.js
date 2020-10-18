import React from 'react';
import {connect} from 'react-redux';

import {closePopout, goBack, openModal, openPopout, setPage} from '../../store/router/actions';

import API from './../../../API/API';
import { SelectedCityID, SelectedCityTitle } from './selectCity';
import { SelectedAddress } from './selectAddress';
import { ownerID, idVK } from './base';
import Icon28Profile from '@vkontakte/icons/dist/28/profile';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';
import { cityID, address, voting } from './base';
import Icon28Notification from '@vkontakte/icons/dist/28/notification';
import Icon28DoorArrowRightOutline from '@vkontakte/icons/dist/28/door_arrow_right_outline';
import Icon16Done from '@vkontakte/icons/dist/16/done';

import {
    Panel,
    PanelHeader,
    PanelHeaderButton,
    PanelHeaderBack,
    Avatar,
    RichCell
} from "@vkontakte/vkui";

var openedAddress, openedCity;

var users = [];

class HomePanelUsers extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            snackbar: null,
            city: '',
            address: address,
            voting: voting
        };

        this.api = new API();
    }

    async componentDidMount() {
        this.api.GetHouseUsers().then((data) => {
            console.log(data);
            users = data;
            this.forceUpdate();
        })
    }

    render() {
        const {id, goBack, setPage} = this.props;
        
        return (
            <Panel id={id}>
                <PanelHeader separator={false} left={<PanelHeaderButton onClick={() =>  goBack() }><PanelHeaderBack/></PanelHeaderButton>}>Список жителей</PanelHeader>
                {users.map((user, index) => 
                    <RichCell
                        disabled
                        multiline
                        href={'https://vk.com/id' + user.id}
                        target="_blank"
                        before={<Avatar size={72} src={user.photo_200} />}
                        caption={user.flat != '0' && user.flat != '' && 'Квартира №' + user.flat}
                    >
                        {user.first_name + ' ' + user.last_name} 
                    </RichCell>
                )}
                {this.state.snackbar}
            </Panel>
        );
    }

}

const mapDispatchToProps = {
    setPage,
    goBack,
    openPopout,
    closePopout,
    openModal
};

const mapStateToProps = (state) => {
    return {
        colorScheme: state.vkui.colorScheme
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePanelUsers);