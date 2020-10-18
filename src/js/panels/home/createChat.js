import React from 'react';
import {connect} from 'react-redux';

import {closePopout, goBack, openModal, openPopout, setPage} from '../../store/router/actions';

import queryString from 'query-string';
import API from './../../../API/API';
import { SelectedCityTitle } from './selectCity';
import bridge from '@vkontakte/vk-bridge'
import Icon16Cancel from '@vkontakte/icons/dist/16/cancel';

import {
    Panel,
    PanelHeader,
    PanelHeaderButton,
    PanelHeaderBack,
    Search,
    Cell,
    PanelSpinner,
    Placeholder,
    FormLayout,
    FormLayoutGroup,
    Input,
    FixedLayout,
    Div,
    Button,
    Snackbar,
    Avatar
} from "@vkontakte/vkui";

var addresses = [];
var SelectedAddress = '';

class HomePanelCreateChat extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            snackbar: null
        };

        this.api = new API();
    }

    async componentDidMount() {
        
    }

    render() {
        const {id, goBack} = this.props;
        
        return (
            <Panel id={id}>
                <PanelHeader separator={false} left={<PanelHeaderButton onClick={() =>  goBack() }><PanelHeaderBack/></PanelHeaderButton>}>Создание чата</PanelHeader>
                <FormLayout>
                    <FormLayoutGroup top="Название">
                        <Input placeholder="Введите название чата" onChange={(e) => {
                            this.setState({ name: e.target.value });
                        }}/>
                    </FormLayoutGroup>
                    <FormLayoutGroup top="Описание">
                        <Input placeholder="Введите описание чата" maxLength="15" onChange={(e) => {
                            this.setState({ description: e.target.value });
                        }}/>
                    </FormLayoutGroup>
                    <FixedLayout vertical="bottom">
                        <Div>
                            <Button size="xl" onClick={() => {
                                if(this.state.name.trim() == '') {
                                    if (this.state.snackbar) return;
                                    this.setState({ snackbar:
                                    <Snackbar
                                        layout="vertical"
                                        onClose={() => this.setState({ snackbar: null })}
                                        before={<Avatar size={24} style={{ backgroundColor: '#ff0000' }}><Icon16Cancel fill="#fff" width={14} height={14} /></Avatar>}
                                    >
                                        Вы не заполнили поле "Название"
                                    </Snackbar>
                                    });
                                    return;
                                }
                                else if(this.state.description.trim() == '') {
                                    if (this.state.snackbar) return;
                                    this.setState({ snackbar:
                                    <Snackbar
                                        layout="vertical"
                                        onClose={() => this.setState({ snackbar: null })}
                                        before={<Avatar size={24} style={{ backgroundColor: '#ff0000' }}><Icon16Cancel fill="#fff" width={14} height={14} /></Avatar>}
                                    >
                                        Вы не заполнили поле "Описание"
                                    </Snackbar>
                                    });
                                    return;
                                }
                                else {
                                    this.api.CreateChat({"title": this.state.name, "desk": this.state.description});
                                    goBack();
                                }
                            }}>Создать чат</Button>
                        </Div>
                    </FixedLayout>
                </FormLayout>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePanelCreateChat);
export var SelectedAddress;