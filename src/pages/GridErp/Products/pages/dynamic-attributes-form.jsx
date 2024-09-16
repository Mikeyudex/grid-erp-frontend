
import React, { useState, useEffect } from 'react';
import { Col, Row, Input, FormGroup, Label } from 'reactstrap';


export function DynamicAttributesForm({ attributeConfigs, handleInputChange, formData }) {

    const [showVariant, setShowVariant] = useState(false);

    const handleToggleVariant = () => {
        setShowVariant(!showVariant);
    }

    return (
        <React.Fragment>

            <Row>
                <Col>
                    <div className='div-1 mt-2' style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', height: '100%' }}>
                        <FormGroup switch >
                            <Input
                                className='pt-2 form-control'
                                style={{ paddingTop: '0.5rem' }}
                                name="showVariant"
                                id="showVariant"
                                type="switch"
                                value={showVariant}
                                onChange={handleToggleVariant}
                            />
                            <Label check>Agregar variantes</Label>
                        </FormGroup>
                    </div>
                </Col>
            </Row>

            <Row>

                {/* Renderizar dinámicamente los campos personalizados */}

                {
                    showVariant === true ? (
                        <>
                            {(attributeConfigs ?? []).map((attr, index) => (
                                <Col key={attr.name} md={4} className='p-2 mt-3'>

                                    {attr.type !== 'switch' && <label className="pt-2" htmlFor={attr.name}>{attr.label}:</label>}
                                    {attr.type === 'select' ? (
                                        <Input
                                            bsSize="md"
                                            key={attr.name}
                                            type='select'
                                            value={formData.attributes[attr.name]}
                                            style={{ border: 'none', borderBottom: '1px solid #132649', background: '#f7f7f9c7' }}
                                            className="form-control pt-2"
                                            name={attr.name}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Selecciona una opción</option>
                                            {attr.options.map((opt, idx) => {
                                                return (<option key={opt} label={opt} value={opt}></option>)
                                            })}
                                        </Input>
                                    ) :

                                        attr.type === 'switch' ? (
                                            <div className='div-1' style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', height: '100%' }}>
                                                <FormGroup switch key={index} >
                                                    <Input
                                                        className='pt-2 form-control'
                                                        key={index}
                                                        style={{ paddingTop: '0.5rem' }}
                                                        name={attr.name}
                                                        id={attr.name}
                                                        type="switch"
                                                        value={formData.attributes[attr.name]}
                                                        bsSize="md"
                                                    />
                                                    <Label key={`${index}-label`} check>{attr.label}</Label>
                                                </FormGroup>
                                            </div>
                                        )
                                            :
                                            (
                                                <Input
                                                    key={attr.name}
                                                    style={{ border: 'none', borderBottom: '1px solid #132649', background: '#f7f7f9c7' }}
                                                    bsSize="md"
                                                    type={attr.type}
                                                    id={attr.name}
                                                    name={attr.name}
                                                    onChange={handleInputChange}
                                                    className='pt-2 form-control'
                                                    value={formData.attributes[attr.name]}
                                                />
                                            )}

                                </Col>
                            ))}
                        </>
                    ) :
                        <>
                            <Row >
                                <Col style={{ height: '40vh' }}></Col>
                            </Row>

                        </>
                }

            </Row>
        </React.Fragment>
    )
}