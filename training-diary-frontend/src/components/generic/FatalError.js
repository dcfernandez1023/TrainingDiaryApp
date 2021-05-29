import { Alert, Button } from 'react-bootstrap';

import '../../styles/fatalError.css';


// used for showing fatal errors of components
const FatalError = (props) => {
  // displays alert
  return (
    <Alert variant="danger">
      <Alert.Heading> Fatal Error </Alert.Heading>
      <p> {props.errorMsg} </p>
      <div className="reload-align">
        <Button variant="outline-danger" onClick={() => {
          if(props.handler === undefined || props.handler === null) {
            window.location.reload();
          }
          else {
            props.handler();
          }
        }}
        >
          Try Again
        </Button>
      </div>
    </Alert>
  );
}

export default FatalError;
