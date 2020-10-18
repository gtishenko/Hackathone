import React from 'react';
import {connect} from 'react-redux';

import {closePopout, goBack, openModal, openPopout, setPage} from '../../store/router/actions';

import dark1 from './../../../image/dark1.png';
import light1 from './../../../image/light1.png';

import queryString from 'query-string';
import API from './../../../API/API';
import { CityID, City } from '../../../App';
import { SelectedCityID, SelectedCityTitle } from './selectCity';
import { SelectedAddress } from './selectAddress';
import Icon16Done from '@vkontakte/icons/dist/16/done';
import Icon28Settings from '@vkontakte/icons/dist/28/settings';
import Icon56InfoOutline from '@vkontakte/icons/dist/56/info_outline';

import {
    Panel,
    Gallery,
    FixedLayout,
    Div,
    Button,
    Text,
    PanelHeader,
    Alert,
    PanelSpinner,
    Snackbar,
    Avatar,
    PanelHeaderButton,
    RichCell,
    Group,
    Placeholder,
    Banner
} from "@vkontakte/vkui";

var ownerID;

var Opened = false;

var slideIndex = 0;

var chats = [];

var idVK;

var cityID, address, voting = false, city;

var Flat;

class HomePanelBase extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            slideIndex: slideIndex,
            theme: '',
            device: '',
            city: SelectedCityTitle,
            cityID: SelectedCityID,
            address: SelectedAddress,
            notRegistered: false,
            loader: true,
            snackbar: null
        };

        this.api = new API();
    }

    componentDidMount() {
        var params = queryString.parse(window.location.search);

        this.setState({
            device: params.vk_platform
        });
        
        this.api.GetUser().then((data) => {
            idVK = data.vkid;
            if(data.city == null) {
                this.setState({ notRegistered: true });
                document.body.style.overflow = "hidden";
                this.setState({ loader: false });
            } else {
                cityID = data.city;
                city = data.cityData[0].title;
                address = data.address;
                voting = data.house.voting;
                Flat = parseInt(data.flat);
                console.log(data.house.voting);
                
                this.forceUpdate();
                
                this.api.GetChats().then((data) => {
                    chats = data.chats;
                    ownerID = data.house.owner;
                    chats.reverse();
                    this.forceUpdate();
                    this.setState({ loader: false });
                });
            }
        });
    }

    render() {
        const {id, setPage, colorScheme, openPopout, closePopout} = this.props;

        var marginTop;
        if(this.state.device == 'desktop_web') marginTop = 15;
        else marginTop = 90;

        var disabled = false;
        if((this.state.city == '' || this.state.address == '') && this.state.slideIndex == 2) disabled = true;
        else disabled = false;
        
        return (
            <Panel id={id}>
                {this.state.notRegistered && <>{this.state.loader ? <PanelSpinner/> : <><Gallery
                    slideWidth="100%"
                    style={{ height: window.innerHeight-15 }}
                    bullets={false}
                    slideIndex={this.state.slideIndex}
                    onChange={(index) => {
                        this.setState({ slideIndex: index });
                        slideIndex = index;
                    }}
                >
                    <div style={{ textAlign: "center", marginTop: marginTop }}>
                        <img style={this.state.device != 'desktop_web' ? { width: '70%' } : { width: '30%' }} src={colorScheme == 'space_gray' ? dark1 : light1}/>
                        <h1>Встречайте — Общедомовые чаты</h1>
                        <Text>Первый сервис ВКонтакте для удобной коммуникации жителей одного дома, обсуждайте различные вопросы, будьте всегда в курсе последних новостей.</Text>
                    </div>
                    <div style={{ textAlign: "center", marginTop: marginTop }}>
                        <img style={this.state.device != 'desktop_web' ? { width: '70%' } : { width: '30%' }} src={colorScheme == 'space_gray' ? dark1 : light1}/>
                        <h1>Поделись с соседями</h1>
                        <Text>Отправляйте приглашения прямо ВКонтакте или генерируйте QR и повесьте у входа, чтобы присоединялись другие соседи.</Text>
                    </div>
                    <div style={{ textAlign: "center", marginTop: marginTop }}>
                        <img style={this.state.device != 'desktop_web' ? { width: '70%' } : { width: '30%' }} src={colorScheme == 'space_gray' ? dark1 : light1}/>
                        <h1>Давайте знакомиться!</h1>
                        <Text>Пожалуйста, выберите свой город</Text>
                        <Div>
                            <Button onClick={() => {
                                if (City != '' && this.state.city == '' && !Opened) {
                                    Opened = true;
                                    openPopout(
                                        <Alert
                                            actions={[{
                                            title: 'Нет',
                                            autoclose: true,
                                            action: () => setPage('home','selectCity')
                                            }, {
                                            title: 'Да',
                                            autoclose: true,
                                            action: () => this.setState({ city: City, cityID: CityID }),
                                            }]}
                                            onClose={closePopout}
                                        >
                                            <h2>Выбор города</h2>
                                            <p>{City} - это ваш город?</p>
                                        </Alert>
                                    )
                                }
                                else {
                                    setPage('home','selectCity');
                                }
                            }} size="xl" mode="secondary">{this.state.city == '' ? "Выбрать город" : this.state.city}</Button>
                        </Div>
                        {this.state.city != '' && <Text>Пожалуйста, введите свой адрес</Text>}
                        {this.state.city != '' && <Div>
                            <Button onClick={() => {
                                setPage('home','selectAddress');
                            }} size="xl" mode="secondary">{this.state.address == '' ? "Ввести адрес" : this.state.address}</Button>
                        </Div>}
                    </div>
                </Gallery>
                <FixedLayout vertical="bottom">
                    <Div><Button onClick={() => {
                        if(this.state.slideIndex == 2) {
                            console.log('+');
                            this.api.SetSettings({"city": SelectedCityID, "address": SelectedAddress, "flat": "0"}).then(() => {
                                console.log('+'); 
                                
                                this.setState({ notRegistered: false });
                                this.api.GetChats().then((data) => {
                                    console.log('+2'); 
                                    chats = data.chats;
                                    ownerID = data.house.owner;
                                    voting = data.house.voting;
                                    chats.reverse();
                                    this.forceUpdate();
                                });
                                document.body.style.overflow = "auto";
                            });
                            if (this.state.snackbar) return;
                            this.setState({ snackbar:
                            <Snackbar
                                layout="vertical"
                                onClose={() => this.setState({ snackbar: null })}
                                before={<Avatar size={24} style={{ backgroundColor: 'var(--accent)' }}><Icon16Done fill="#fff" width={14} height={14} /></Avatar>}
                            >
                                Аккаунт успешно зарегистрирован!
                            </Snackbar>
                            });
                        } else {
                            this.setState({
                                slideIndex: this.state.slideIndex+1
                            });
                            slideIndex = this.state.slideIndex+1;
                        }
                    }} disabled={disabled} size="xl">{this.state.slideIndex == 2 ? "Начать!" : "Далее"}</Button></Div>
                </FixedLayout></>}</>}



                {!this.state.notRegistered && <>
                    <PanelHeader left={<PanelHeaderButton><Icon28Settings onClick={() => setPage('home','settings')}/></PanelHeaderButton>}>Список чатов дома</PanelHeader>
                    {this.state.loader ? <PanelSpinner/> : <>
                        {chats.length > 0 && <Group style={{ marginBottom: 90 }}>
                            {chats.map((chat, index) => <>
                                {console.log(index)}
                                <RichCell
                                    disabled
                                    multiline
                                    before={<Avatar size={72} src={"https://vk.com/images/icons//multichat80_2x.png"} />}
                                    text={chat.desk}
                                    actions={<>
                                    <Button href={chat.link} target="_blank">Присоединиться</Button>
                                    {ownerID == idVK && <Button mode="destructive">Удалить</Button>}
                                    </>}
                                >
                                    {chat.name}
                                </RichCell>
                            </>)}
                        </Group>}
                        {chats.length == 0 && <Placeholder
                            icon={<Icon56InfoOutline />}
                            header="Список чатов"
                            action={<Button onClick={() => setPage('home','createChat')} size="l">Создать чат</Button>}
                        >
                            К сожалению, никто еще не создал ни одного чата.
                        </Placeholder>}
                        {chats.length > 0 && <FixedLayout filled vertical="bottom">
                            <Div>
                                <Button onClick={() => setPage('home','createChat')} size="xl">Создать чат</Button>
                            </Div>
                        </FixedLayout>}
                    </>}
                </>}
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePanelBase);
export var ownerID;
export var idVK;
export var cityID;
export var address;
export var voting;
export var Flat;
export var city;