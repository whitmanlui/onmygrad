import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, Text as T, KeyboardAvoidingView, TextInput, SafeAreaView } from 'react-native';
import { styles as s } from 'react-native-style-tachyons'
import { Header, Overlay, Button, Icon } from 'react-native-elements';
import _ from 'lodash'

class QuestionInputScreen extends Component {
    state={title: '', tags: [], tag: '', content: '', height: 0}
    renderTags=()=>{
        return _.map(this.state.tags, (v)=>{
            return <V style={[s.br5, {backgroundColor: '#ffd926', color: '#ffffff'}]}><T>{v}</T></V>
        })
    }
    render() {
        return (
            <Overlay isVisible={this.props.isVisible} fullScreen={true} overlayStyle={{padding: 0, }}>
            <SafeAreaView><V style={[s.flx_i]}>
                <Header
                    containerStyle={[{ backgroundColor: '#ced4da', paddingTop: 0, height: 50}, s.flx_row]}
                    leftComponent={<Button icon={<Icon name='times' color='#495057' type='font-awesome' />} onPress={()=>this.props.close()} type="clear"  />}
                    //centerComponent={{ text: 'MY TITLE', style: { color: '#495057' } }}
                    rightComponent={{ text: 'Preview', style: { color: '#495057' } }}
                />
                <V style={{ flex: 1, backgroundColor: 'white' }}>
                    <V style={{ flex: 1 }}>
                        <TextInput
                            style={{borderBottomWidth: 1}}
                            placeholder={'Title Here'}
                            onChangeText={(title) => { this.setState({title}) }}
                        />
                        <V>
                            <V>{this.renderTags()}</V>
                            <TextInput
                                style={{borderBottomWidth: 1}}
                                placeholder={'Add tags'}
                                value={this.state.tag}
                                onChangeText={(tag) => { this.setState({tag}) }}
                                onEndEditing={() => { 
                                    this.setState({tags: [...this.state.tags,this.state.tag], tag: ''}) 
                                }}
                            />
                        </V>
                        <TextInput
                            style={{borderBottomWidth: 1, height: this.state.height}}
                            placeholder={'Content Here'}
                            multiline
                            onChangeText={(content) => { this.setState({content}) }}
                            onContentSizeChange={(event) => {
                                this.setState({ height: event.nativeEvent.contentSize.height })
                            }}
                        />
                    </V>
                    <KeyboardAvoidingView
                        style={[{ backgroundColor: '#ced4da' }, s.flx_row]}
                    >
                        <V style={[s.flx_i]}><Button icon={<Icon name='angle-down' color='#495057' type='font-awesome' />}  type="clear" /></V>
                        <V style={[s.flx_i]}><Button icon={<Icon name='smile-o' color='#495057' type='font-awesome' />}  type="clear" /></V>
                        <V style={[s.flx_i]}><Button icon={<Icon name='camera' color='#495057' type='font-awesome' />}  type="clear" /></V>
                        <V style={[s.flx_i]}><Button icon={<Icon name='image' color='#495057' type='font-awesome' />}  type="clear" /></V>
                        <V style={[s.flx_i]}><Button icon={<Icon name='arrow-left' color='#495057' type='font-awesome' />}  type="clear" /></V>
                        <V style={[s.flx_i]}><Button icon={<Icon name='arrow-right' color='#495057' type='font-awesome' />}  type="clear" /></V>
                        <V style={[s.flx_i]}><Button icon={<Icon name='plus-circle' color='#495057' type='font-awesome' />}  type="clear" /></V>
                    </KeyboardAvoidingView>
                </V>
            </V></SafeAreaView>
            </Overlay>
            
        );
    }
}

export default QuestionInput = connect(
    (state, props) => ({
      lang: state.app.lang,
    }),
    (dispatch, props) => ({
      
    }),
)(QuestionInputScreen)
