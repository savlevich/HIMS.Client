import  React, {PropTypes} from 'react';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter
} from 'react-modal-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import  * as testActions from '../../actions/testActions';
import TestForm from './TestForm';

class AddEditTestPopup extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isOpen: true,
      test: Object.assign({}, this.props.test)
    };

    this.saveTest = this.saveTest.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.updateTestState = this.updateTestState.bind(this);
  }

  saveTest() {
    this.props.actions.saveTest(this.state.test);
    this.closeModal();
  }

  closeModal()  {
    this.setState({
      isOpen: false
    }, () => {
      let {router} = this.context;
      if (router.goBack) {
        router.goBack();
      } else {
        router.push('/');
      }
    });
  }

  updateTestState(event) {
    const field = event.target.name;
    let test = this.state.test;
    test[field] = event.target.value;
    return this.setState( {test: test} );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.test.testId != nextProps.test.testId) {
      this.setState({test: Object.assign({}, nextProps.test)});
    }
  }

  render() {
    const title = this.state.test.testId
      ? 'Edit test record'
      : 'Add test record';

    return (
      <Modal isOpen={this.state.isOpen} onRequestHide={this.closeModal}>
        <ModalHeader>
          <ModalClose onClick={this.closeModal}/>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        <ModalBody>
        <TestForm test={this.state.test} onChange={this.updateTestState}/>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-default" onClick={this.closeModal}>
            Close
          </button>
          <button className="btn btn-primary" onClick={this.saveTest}>
            Save
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

AddEditTestPopup.contextTypes = {
  router: PropTypes.object
};

AddEditTestPopup.propTypes = {
  test: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

function getTestById(tests, id) {
  const test = tests.filter(test => test.testId == id);
  if (test) return test[0];
  return null;
}


function mapStateToProps(state, ownProps) {
  const testId = ownProps.params.id;

  let test = {testId: NaN, name: '', description: ''};

  if(testId && state.tests.length > 0) {
    test = getTestById(state.tests, testId);
  }

  return {
    test: test
  };
}

function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators(testActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditTestPopup);