import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import * as api from '../api/apiService';

export default function ModalGrade({ onSave, onClose, selectedGrade }) {
  Modal.setAppElement('#root'); //Necessário para que o React-Modal saiba onde o React está.

  const { id, student, subject, type, value } = selectedGrade;

  const [gradeValue, setGradeValue] = useState(value);
  const [gradeValidation, setGradeValidation] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getValidation = async () => {
      const validation = await api.getValidationFromGradeType(type);
      setGradeValidation(validation);
    };

    getValidation();
  }, [type]);

  useEffect(() => {
    const { minValue, maxValue } = gradeValidation;
    if (gradeValue < minValue || gradeValue > maxValue) {
      setErrorMessage(
        `O Valor da Nota deve ser entre ${minValue} e ${maxValue}.`
      );
      return;
    }
    
    setErrorMessage('');
  }, [gradeValue, gradeValidation]);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose(null);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleGradeChange = (event) => {
    setGradeValue(+event.target.value); //Outra forma de converter String em Number.
  };

  const handleModalClose = () => {
    onClose();
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = {
      id, 
      newValue: gradeValue,
    };

    onSave(formData);
  }


  return (
    <div>
      <Modal isOpen={true}>
        <form onSubmit={handleFormSubmit}>
          <div style={styles.flexRow}>
            <span style={styles.title}>Manutenção de Notas</span>
            <button
              style={styles.closeBtn}
              className="waves-effect waves-light btn red darken-4"
              onClick={handleModalClose}
            >
              x
            </button>
          </div>

          <div className='input-field'>
            <input id="inputName" type="text" value={student} readOnly />
            <label className="active" htmlFor="inputName">
              Nome do Aluno:{' '}
            </label>
          </div>

          <div className='input-field'>
            <input id="inputSubject" type="text" value={subject} readOnly />
            <label className="active" htmlFor="inputSubject">
              Disciplina:{' '}
            </label>
          </div>

          <div className='input-field'>
            <input id="inputType" type="text" value={type} readOnly />
            <label className="active" htmlFor="inputType">
              Tipo de Avaliação:{' '}
            </label>
          </div>

          <div className='input-field'>
            <input
              id="inputGrade"
              type="number"
              min={gradeValidation.minValue}
              max={gradeValidation.maxValue}
              step="1"
              autoFocus
              onChange={handleGradeChange}
              value={gradeValue}
            />
            <label className="active" htmlFor="inputGrade">
              Nota:{' '}
            </label>
          </div>

          <div style={styles.flexRow}>
            <button
              className="waves-effect waves-light btn"
              disabled={errorMessage.trim() !== ''}
            >
              Salvar
            </button>
            <span style={{color: 'red'}}>{errorMessage}</span>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const styles = {
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  closeBtn: {
    borderRadius: '50%',
  },

  title: {
    fontSize: '1.3rem',
    fontWeight: '700',
    marginBottom: '40px',
  },

};
