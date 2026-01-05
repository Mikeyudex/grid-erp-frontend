


export function StylesLayoutCreateProduct(props) {

    return (
        <style jsx>{`
    .floating-input-container {
      position: relative;
      margin-bottom: 1.5rem;
    }

    .floating-input {
      width: 100%;
      padding: 1rem 0.75rem 0.5rem 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 0.375rem;
      font-size: 1rem;
      background-color: #fff;
      transition: all 0.2s ease-in-out;
    }

    .floating-input:focus {
      outline: none;
      border-color: #0d6efd;
      box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
    }

    .floating-label {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background-color: #fff;
      padding: 0 0.25rem;
      color: #6c757d;
      font-size: 1rem;
      transition: all 0.2s ease-in-out;
      pointer-events: none;
    }

    .floating-input:focus + .floating-label,
    .floating-input.has-value + .floating-label {
      top: 0;
      transform: translateY(-50%);
      font-size: 0.75rem;
      color: #0d6efd;
      font-weight: 500;
    }

    .section-card {
      border: 1px solid #e9ecef;
      box-shadow: 0 2px 4px rgba(0,0,0,0.04);
    }

    .section-header {
      border-bottom: 1px solid #e9ecef;
      transition: background-color 0.2s ease;
    }

    .section-header:hover {
      background-color: #f8f9fa;
    }

    .section-title {
      color: #333;
      font-weight: 600;
    }

    .type-option {
      border: 2px solid #e9ecef;
      border-radius: 0.5rem;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      height: 100%;
    }

    .type-option:hover {
      border-color: #0d6efd;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .type-option.selected {
      border-color: #0d6efd;
      background-color: #f8f9ff;
    }

    .type-option input[type="radio"] {
      transform: scale(1.2);
    }

    .contact-card {
      border: 1px solid #e9ecef;
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin-bottom: 1rem;
      background-color: #f8f9fa;
    }

    .custom-field-row {
      background-color: #f8f9fa;
      border-radius: 0.375rem;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .btn-floating {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
    }

    @media (max-width: 768px) {
      .floating-input {
        padding: 0.875rem 0.75rem 0.375rem 0.75rem;
      }
      
      .btn-floating {
        bottom: 1rem;
        right: 1rem;
        width: 50px;
        height: 50px;
      }
    }
  `}</style>
    )
}