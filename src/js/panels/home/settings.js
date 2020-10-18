import React from 'react';
import {connect} from 'react-redux';

import {closePopout, goBack, openModal, openPopout, setPage} from '../../store/router/actions';

import API from './../../../API/API';
import { SelectedCityID, SelectedCityTitle } from './selectCity';
import { SelectedAddress } from './selectAddress';
import { ownerID, idVK, address, voting, city } from './base';
import Icon28Profile from '@vkontakte/icons/dist/28/profile';
import Icon28Users3Outline from '@vkontakte/icons/dist/28/users_3_outline';
import Icon28Notification from '@vkontakte/icons/dist/28/notification';
import Icon28DoorArrowRightOutline from '@vkontakte/icons/dist/28/door_arrow_right_outline';
import Icon16Done from '@vkontakte/icons/dist/16/done';
import {Flat} from './base';

import {
    Panel,
    PanelHeader,
    PanelHeaderButton,
    PanelHeaderBack,
    FormLayout,
    FormLayoutGroup,
    FixedLayout,
    Div,
    Button,
    Group,
    Header,
    CellButton,
    Snackbar,
    Avatar,
    Input
} from "@vkontakte/vkui";

var openedAddress, openedCity, flat, firstOpen = true;

class HomePanelSettings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            snackbar: null,
            city: city,
            address: address,
            voting: voting,
            flat: flat,
            cityID: city
        };

        this.api = new API();
    }

    async componentDidMount() {
        if(firstOpen) {
            flat = Flat;

            this.setState({
                flat: Flat
            })
            
            firstOpen = false;
            this.forceUpdate();
        }
        
        if(openedCity) {
            if(SelectedCityID != '') {
                this.setState({
                    city: SelectedCityTitle,
                    cityID: SelectedCityID
                });
            }
        }
        if(openedAddress) {
            if(SelectedAddress != '') {
                this.setState({
                    address: SelectedAddress
                });
            }
        }
    }

    render() {
        const {id, goBack, setPage} = this.props;
        
        return (
            <Panel id={id}>
                <PanelHeader separator={false} left={<PanelHeaderButton onClick={() =>  goBack() }><PanelHeaderBack/></PanelHeaderButton>}>Настройки</PanelHeader>
                {ownerID == null && <Group header={<Header>Настройки дома</Header>}>
                    <CellButton disabled={this.state.voting} onClick={() => {
                        this.setState({
                            voting: true
                        })
                        this.api.StartElections();
                        if (this.state.snackbar) return;
                            this.setState({ snackbar:
                            <Snackbar
                                layout="vertical"
                                onClose={() => this.setState({ snackbar: null })}
                                before={<Avatar size={24} style={{ backgroundColor: 'var(--accent)' }}><Icon16Done fill="#fff" width={14} height={14} /></Avatar>}
                            >
                                Вы успешно запустили выборы управдома!
                            </Snackbar>
                            });
                    }} before={<Icon28Profile/>}>Начать выборы управдома</CellButton>
                    {/*<Div>
                        <Button size="xl">Создать QR-код для печати</Button>
                    </Div>*/}
                </Group>}
                <CellButton onClick={() => {
                    setPage('home','users');
                }} before={<Icon28Users3Outline/>}>Открыть список жителей дома</CellButton>
                {ownerID == idVK && <Group header={<Header>Настройки дома</Header>}>
                    <CellButton before={<Icon28Notification/>}>Сделать объявление</CellButton>
                    <CellButton onClick={() => {
                        this.api.LeaveAdmin().then(() => {
                            goBack();
                        })
                    }} before={<Icon28DoorArrowRightOutline/>} mode="danger">Покинуть пост управдома</CellButton>
                </Group>}
                <Group style={{ marginBottom: 90 }} header={<Header>Личные настройки</Header>}>
                    <FormLayout>
                        <FormLayoutGroup top="Город">
                            <Button onClick={() => {
                                openedCity = true;
                                setPage('home','selectCity');
                            }} size="xl" mode="secondary">{this.state.city == '' ? "Выбрать город" : this.state.city}</Button>
                        </FormLayoutGroup>
                        <FormLayoutGroup top="Адрес">
                            <Button onClick={() => {
                                    openedAddress = true;
                                    setPage('home','selectAddress');
                                }} size="xl" mode="secondary">{this.state.address == '' ? "Ввести адрес" : this.state.address}</Button>
                        </FormLayoutGroup>
                        <FormLayoutGroup top="Квартира">
                            <Input value={this.state.flat} onChange={(e) => {
                                var value = e.target.value.replace(/[^+\d]/g, '').replace('+','').replace('-','').substring(0,4);
                                this.setState({
                                  flat: value
                                });
                                flat = value;
                            }} inputMode="num"/>
                        </FormLayoutGroup>
                    </FormLayout>
                </Group>
                <FixedLayout filled vertical="bottom">
                    <Div>
                        <Button size="xl" onClick={() => {
                            this.api.SetSettings({"city": this.state.cityID, "address": this.state.address, "flat": this.state.flat});
                            goBack();
                        }}>Сохранить настройки</Button>
                    </Div>
                </FixedLayout>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePanelSettings);