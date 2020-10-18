import React from 'react';
import {connect} from 'react-redux';

import {closePopout, goBack, openModal, openPopout, setPage} from '../../store/router/actions';

import queryString from 'query-string';
import API from './../../../API/API';
import { SelectedCityTitle } from './selectCity';
import bridge from '@vkontakte/vk-bridge'
import Icon56InfoOutline from '@vkontakte/icons/dist/56/info_outline';

import {
    Panel,
    PanelHeader,
    PanelHeaderButton,
    PanelHeaderBack,
    Search,
    Cell,
    PanelSpinner,
    Placeholder
} from "@vkontakte/vkui";

var addresses = [];
var SelectedAddress = '';

class HomePanelSelectAddress extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            city: '',
            cityID: '',
            loader: true,
            search: '',
            lastValue: ''
        };

        this.api = new API();
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.setState({ search: e.target.value });
    }

    async componentDidMount() {
        var params = queryString.parse(window.location.search);

        this.setState({
            device: params.vk_platform
        });

        document.body.style.overflow = "auto";
        //this.api.GetUser();
        this.setState({ loader: true });
        this.api.GetAddress(SelectedCityTitle + " ул")
        .then(result => {
            console.log(result);
            
            addresses = result.suggestions;
            console.log(result.suggestions);
            this.setState({ loader: false });
            
            this.forceUpdate();
        })
        .catch(error => {
            console.log("error", error);
            this.setState({ loader: false });
        });
        const interval = setInterval(() => {
            if(this.state.lastValue == this.state.search) return;
            this.setState({
                lastValue: this.state.search
            });
            this.setState({ loader: true });
            this.api.GetAddress(SelectedCityTitle + ' ' + this.state.search)
            .then(result => {
                addresses = result.suggestions;
                this.forceUpdate();
                this.setState({ loader: false });
            })
            .catch(error => {
                console.log("error", error);
                this.setState({ loader: false });
            });
        }, 500);
    }

    render() {
        const {id, goBack} = this.props;
        
        return (
            <Panel id={id}>
                <PanelHeader separator={false} left={<PanelHeaderButton onClick={() =>  goBack() }><PanelHeaderBack/></PanelHeaderButton>}>Выбор города</PanelHeader>
                <Search onChange={this.onChange}/>
                {this.state.loader ? <PanelSpinner/> : <>
                    {addresses.length != 0 && <>
                        {addresses.map((address, index) => <>
                            <Cell onClick={() => {
                                SelectedAddress = address.value;
                                goBack();
                            }} expandable>{address.value}</Cell>
                        </>)}
                    </>}
                    {addresses.length == 0 && <Placeholder
                        icon={<Icon56InfoOutline />}
                        header="Ничего не найдено"
                    >
                        Попробуйте изменить запрос
                    </Placeholder>}
                </>}
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePanelSelectAddress);
export var SelectedAddress;