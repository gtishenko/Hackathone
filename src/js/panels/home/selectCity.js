import React from 'react';
import {connect} from 'react-redux';

import {closePopout, goBack, openModal, openPopout, setPage} from '../../store/router/actions';

import queryString from 'query-string';
import API from './../../../API/API';
import { CityID, City } from '../../../App';
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

var cities = [];
var SelectedCityTitle = '', SelectedCityID = '';

class HomePanelSelectCity extends React.Component {

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
        this.setState({ loader: true });
        await this.api.GetCities({country_id: "1", "lang": "ru"}).then((data) => {
            console.log(data.items);
            
            cities = data.items;
            this.forceUpdate();
        })
        this.setState({ loader: false });
        const interval = setInterval(() => {
            if(this.state.lastValue == this.state.search) return;
            this.setState({
                lastValue: this.state.search
            });
            this.setState({ loader: true });
            this.api.GetCities({country_id: "1", "q": this.state.search, "lang": "ru"}).then((data) => {
                console.log(data.items);
                
                cities = data.items;
                this.forceUpdate();
                this.setState({ loader: false });
            });
        }, 500);
    }

    render() {
        const {id, goBack} = this.props;
        
        return (
            <Panel id={id}>
                <PanelHeader separator={false} left={<PanelHeaderButton onClick={() =>  goBack() }><PanelHeaderBack/></PanelHeaderButton>}>Выбор города</PanelHeader>
                <Search maxLength="15" onChange={this.onChange}/>
                {this.state.loader ? <PanelSpinner/> : <>
                    {cities.length != 0 && <>
                        {cities.map((city, index) => <>
                            <Cell description={city.area != undefined && city.region != undefined && city.area + ' •‎ ' + city.region} onClick={() => {
                                SelectedCityTitle = city.title;
                                SelectedCityID = city.id;
                                goBack();
                            }} expandable>{city.important == 1 ? <strong>{city.title}</strong> : city.title}</Cell>
                        </>)}
                    </>}
                    {cities.length == 0 && <Placeholder
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePanelSelectCity);
export var SelectedCityTitle;
export var SelectedCityID;