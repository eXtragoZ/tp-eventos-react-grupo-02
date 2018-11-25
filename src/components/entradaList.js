import { List } from '@material-ui/core';
import React, { Component, Fragment } from 'react';
import { devolverEntrada, getEntradas } from '../services/eventoService';
import { getUsuarioLogueado } from '../services/usuarioService';
import EntradaRow from './entradaRow';
import Fotter from './Fotter';

export class EntradaList extends Component {

    constructor(props) {
        super(props)
        this.state = {entradas: []}

        EntradaRow.defaultProps = { devolucionEntrada: this.devolucionEntrada }
    }

    async componentDidMount() {
        try {
            const usuario = await getUsuarioLogueado()
            const entradas = await getEntradas()

            this.setState({saldo: usuario.saldo, entradas, error: null })
        } catch (error) {
            this.setState({ error })
        }

        try {
            const entradas = await getEntradas()
            this.setState({ entradas, error: null })
        } catch (error) {
            this.setState({ error })
        }
    }

    devolucionEntrada = async (entrada) => {
        try {
            await devolverEntrada(entrada)
            const nuevaLista = this.state.entradas
                .map(en => en === entrada ? entrada.devolverUna() : en)
                .filter(en => en.cantidad !== 0)
            this.setState({ entradas: nuevaLista, error: null })

            const usuario = await getUsuarioLogueado()
            this.setState({saldo: usuario.saldo})
    
        } catch (error) {
            this.setState({ error })
        }
    }

    render() {
        const { saldo } = this.state
        return (
            <Fragment>
                <List dense={true}>
                    {this.state.entradas.map(entrada =>
                        <EntradaRow key={'card' + entrada.evento.descripcion} entrada={entrada} />
                    )}
                </List>
                <Fotter saldo={saldo} />
            </Fragment>
        )
    }
}
