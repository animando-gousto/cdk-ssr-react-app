import { LinkModal, Button } from '../../component-lib';

const HomePage = () => <>
  Home
  <LinkModal label={'Information'} header={<p>Yo yo!</p>}>
    {({onClose}) =>
      <Button onClick={onClose}>Click to Close</Button>
    }
  </LinkModal>
</>

export default HomePage;
