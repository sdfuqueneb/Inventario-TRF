import styled from "styled-components";

export function InputText({ children, icono }) {
  return (
    <Container>
      <span className="icon-container">{icono}</span>
      <div className="form__group field">{children}</div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  
  .icon-container {
    color: ${(props) => props.theme.primary}; 
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    margin-top: 15px;
  }

  p {
    color: #2EC971; 
    font-size: 0.8rem;
    text-align: left;
    margin: 4px 0;
  }

  .form__group {
    position: relative;
    padding: 20px 0 0;
    width: 100%;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-background-clip: text;
    -webkit-text-fill-color: ${(props) => props.theme.text};
    transition: background-color 5000s ease-in-out 0s;
  }

  .form__field {
    font-family: inherit;
    width: 100%;
    border: none;
    border-bottom: 2px solid #DDE2E6; 
    outline: 0;
    font-size: 16px;
    color: ${(props) => props.theme.text};
    padding: 7px 0;
    background: transparent;
    transition: border-color 0.2s;

    &.disabled {
      color: #696969;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      margin-top: 8px;
      border-bottom: 1px dashed #9b9b9b;
    }
  }

  .form__field::placeholder {
    color: transparent;
  }

  .form__field:placeholder-shown ~ .form__label {
    font-size: 16px;
    cursor: text;
    top: 20px;
  }

  .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 16px;
    color: #9b9b9b; 
    pointer-events: none;
  }

  .form__field:focus {
    padding-bottom: 6px;
    font-weight: 600;
    border-width: 2px;
    border-image: linear-gradient(to right, #012452, #2EC971);
    border-image-slice: 1;
  }

  .form__field:focus ~ .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 14px;
    color: #012452;
    font-weight: 700;
  }

  .form__field:required,
  .form__field:invalid {
    box-shadow: none;
  }
`;