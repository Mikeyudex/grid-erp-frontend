
import React, { useState, useEffect } from 'react';
import { Col, Row, Input, FormGroup, Label, Card, CardHeader, CardBody } from 'reactstrap';
import * as url from "../helper/url_helper";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { ProductHelper } from '../helper/product_helper';


// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
const helper = new ProductHelper();

export function AdditionalConfigs({ handleInputChangeAdditionalConfigs, additionalConfigs, setFileData, fileData }) {


    return (
        <React.Fragment>

            <Row className='mt-4'>

                <Row>
                    <Col md={6}>
                        <div className='div-1 mt-2' style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', height: '100%' }}>
                            <FormGroup switch >
                                <Input
                                    className='pt-2 form-control'
                                    style={{ paddingTop: '0.5rem' }}
                                    name="hasBarcode"
                                    id="hasBarcode"
                                    type="switch"
                                    checked={additionalConfigs.hasBarcode}
                                    value={additionalConfigs.hasBarcode}
                                    onChange={handleInputChangeAdditionalConfigs}
                                />
                                <Label check>Producto con código de barras</Label>
                            </FormGroup>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col lg={6} className='mt-4 pt-1'>
                        <Card style={{ backgroundColor: '#f7f7f9' }}>
                            <CardHeader style={{ backgroundColor: '#f7f7f9' }}>
                                <h4 className="card-title mb-0">Suba las imágenes del producto aquí</h4>
                            </CardHeader>

                            <CardBody>
                                <FilePond
                                    acceptedFileTypes={acceptedFileTypes}
                                    fileValidateTypeLabelExpectedTypesMap={{
                                        'image/jpeg': '.jpg',
                                        'image/png': '.png',
                                        'image/gif': '.gif',
                                    }}
                                    labelFileTypeNotAllowed={'Solo se permiten archivos de imagen.'}
                                    beforeAddFile={(file) => {
                                        const fileType = file.fileType;
                                        if (!acceptedFileTypes.includes(fileType)) {
                                            /* alert('Solo se permiten archivos de imagen.'); */
                                            return false;
                                        }
                                        return true;
                                    }}
                                    server={
                                        {
                                            process: {
                                                url: url.UPLOAD_IMAGES,
                                                method: 'POST',
                                                withCredentials: false,
                                                onload: (response) => {
                                                    const { url, storageId } = JSON.parse(response);
                                                    return JSON.stringify({ url, storageId });
                                                },
                                                onerror: (response) => {
                                                    console.error('Error uploading file:', response);
                                                },
                                            },
                                            revert: async (uniqueFileId, load, error) => {
                                                try {
                                                    const { storageId } = JSON.parse(uniqueFileId);
                                                    let data = await helper.deleteImageProduct(storageId);
                                                    if (data?.status === 'success') {
                                                        let newFileData = fileData.filter((file) => file.storageId !== storageId)
                                                        setFileData(newFileData);
                                                        load();
                                                    } else {
                                                        error('Could not delete file');
                                                    }
                                                } catch (e) {
                                                    error('Could not delete file');
                                                }
                                            }
                                        }
                                    }
                                    onprocessfile={(error, file) => {
                                        if (error) {
                                            console.error('Error processing file:', error);
                                            return;
                                        }
                                        const { file: fileInfo } = file;
                                        const { name } = fileInfo;
                                        // Add the URL and storageId to fileData
                                        setFileData((prevData) => [
                                            ...prevData,
                                            {
                                                url: JSON.parse(file.serverId).url,  // URL returned by onload
                                                storageId: JSON.parse(file.serverId).storageId, // Extract storageId from serverId
                                                name,
                                            },
                                        ]);
                                    }}
                                    allowMultiple={true}
                                    maxFiles={4}
                                    name="files"
                                    className="filepond filepond-input-multiple"
                                    labelIdle='Arrastra tus archivos aquí or <span class="filepond--label-action">Buscar</span>'
                                    labelFileLoadError="Error durante la carga"
                                    labelFileProcessingError="Error al cargar la imagen"
                                    labelTapToCancel="Tap para cancelar"
                                    labelTapToRetry="Tap para reintentar"
                                    labelTapToUndo="Tap para revertir"
                                    labelFileProcessing="Subiendo"
                                    labelFileProcessingComplete="Carga completa"
                                    labelFileProcessingAborted="Carga cancelada"
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Row>
        </React.Fragment>
    )
}