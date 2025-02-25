import React, { useState } from 'react';
import { Button, Title } from '@examsecure/design-system';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFirebaseConnect } from 'react-redux-firebase';
import LoadingSpinner from '../helpers/LoadingSpinner';

const ProctorModeTestSelector = () => {
  const router = useHistory();
  const [selectedTestID, setSelectedTestID] = useState('');

  const uid = useSelector((state) => state.firebase.auth.uid);
  useFirebaseConnect(() => [{ path: `tests/${uid}` }]);
  const testsWrapper = useSelector((state) => state.firebase.data.tests);
  const tests = testsWrapper && testsWrapper[uid];

  const handleChange = (e) => {
    const { value } = e.target;
    setSelectedTestID(value);
  };

  const handleGoToDashboard = () => {
    router.push(`/proctor-mode/proctor_dashboard?test=${selectedTestID}`);
  };

  return (
    <div>
      <div className="proc-dash-wrapper">
        <div>
          <Title value={'Painel de monitoria'} />
        </div>

        <div className="proc-test-selector-container">
          <h3>Selecione o teste</h3>
          <div style={{ marginBottom: '1rem', color: '#868181' }}>
            Selecione um teste para continuar
          </div>
          <div className="proc-test-selector">
            {!tests ? (
              <div className="loading-spinner">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="dash-tests-container">
                <Form.Group>
                  <Form.Control as={'select'} onChange={handleChange}>
                    <option value="">Selecione um tste</option>
                    {Object.entries(tests)?.map(([id, test]) => (
                      <option value={id} key={id}>
                        {test.test_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
            )}
          </div>
          <Button
            label={'Ir para Painel de Monitoria'}
            variant={'secondary'}
            onClick={handleGoToDashboard}
          />
        </div>
      </div>
    </div>
  );
};

export default ProctorModeTestSelector;
