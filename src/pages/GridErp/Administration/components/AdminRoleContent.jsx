import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Container, Input, Label, Row } from 'reactstrap';

import * as url from '../../../../helpers/url_helper';
import { getToken } from '../../../../helpers/jwt-token-access/get_token';
import AlertCustom from '../../../../Components/Common/Alert';
import { isAdminValidate } from '../../../../helpers/validations-helpers';


const AdminRolesContent = () => {

    const [loading, setLoading] = useState(true);
    const [messsageAlert, setMessageAlert] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [typeModal, setTypeModal] = useState('success');

    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [newRoleName, setNewRoleName] = useState("");
    const [newRoleDescription, setNewRoleDescription] = useState("");
    const [availableResources, setAvailableResources] = useState([]);
    const [currentRole, setCurrentRole] = useState({});
    const [reloadRoles, setReloadRoles] = useState(false);
    const [filteredRoles, setFilteredRoles] = useState([]);


    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 3;

    const handleFilterRoles = () => {
        let filteredRoles = (roles ?? []).filter((role) => {
            return (
                (!searchTerm ||
                    role?.name.toLowerCase().includes(searchTerm.toLowerCase())) /* &&
                (!selectedRole || role?._id !== selectedRole) */
            );
        });
        let paginatedRoles = handlePagination(filteredRoles);
        return paginatedRoles;
    };

    const handlePagination = (_roles) => {
        // Calcular total de páginas
        let totalPages = Math.ceil(_roles.length / itemsPerPage);

        // Obtener los mensajes de la página actual
        const paginatedRoles = _roles.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
        setTotalPages(totalPages);
        return paginatedRoles;
    }

    const handleResourceToggle = (resourcePath) => {
        setRoles(
            roles.map((role) => {
                if (role?._id === selectedRole) {
                    if (!role?.resources) role.resources = [];
                    if (typeof role.resources === 'string') role.resources = [role.resources];
                    const hasResource = role?.resources.includes(resourcePath);
                    return {
                        ...role,
                        resources: hasResource
                            ? role.resources.filter((r) => r !== resourcePath)
                            : [...role.resources, resourcePath],
                    }
                }
                return role
            }),
        )
    }

    const addNewRole = async () => {
        setMessageAlert('');
        setIsOpenModal(false);
        setTypeModal('success');

        if (!newRoleName.trim()) {
            setMessageAlert('El nombre del rol no puede estar vacío');
            setIsOpenModal(true);
            setTypeModal('danger');
            return;
        }

        const newRole = {
            name: newRoleName,
            description: newRoleDescription,
            resources: [availableResources.filter((resource) => resource?.path === "/home")[0]?._id]// Default access to home
        }

        try {
            let token = getToken();
            await fetch(`${url.BASE_URL}${url.ADD_ROLE}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newRole)
            });
            setNewRoleDescription("");
            setNewRoleName("");
            setMessageAlert('Rol creado exitosamente');
            setIsOpenModal(true);
            setTypeModal('success');
            setReloadRoles(!reloadRoles);
        } catch (error) {
            console.log(error);
            return;
        }
    }

    const deleteRole = async (roleId) => {
        setMessageAlert('');
        setIsOpenModal(false);
        setTypeModal('success');

        if (roles.length <= 1) {
            setMessageAlert('Error: No se puede eliminar el último rol');
            setIsOpenModal(true);
            setTypeModal('danger');
            return
        }

        if (!roleId) {
            setMessageAlert('Error: No se puede eliminar el último rol');
            setIsOpenModal(true);
            setTypeModal('danger');
            return
        }

        try {
            let token = getToken();
            let response = await fetch(`${url.BASE_URL}${url.DELETE_ROLE}/${roleId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            let data = await response.json();
            if (response.status !== 200) {
                setMessageAlert(data?.message);
                setIsOpenModal(true);
                setTypeModal('danger');
                return;
            }
            setMessageAlert(data?.message);
            setIsOpenModal(true);
            setTypeModal('success');
            setReloadRoles(!reloadRoles);
        } catch (error) {
            setMessageAlert(error?.message);
            setIsOpenModal(true);
            setTypeModal('danger');
            return;
        }
    }

    const addResourcesToRole = async () => {
        setMessageAlert('');
        setIsOpenModal(false);
        setTypeModal('success');
        try {
            let token = getToken();
            let resourcesSelectedPath = roles.filter((role) => role?._id === selectedRole)?.[0]?.resources;
            let resourcesSelected = availableResources.filter((resource) => resourcesSelectedPath.includes(resource?.path));
            let resourcesSelectedIds = resourcesSelected.map((resource) => resource?._id);
            let payload = {
                resource: resourcesSelectedIds
            }
            let response = await fetch(`${url.BASE_URL}${url.ADD_RESOURCES_ROLE}/${selectedRole}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            let data = await response.json();

            if (response.status !== 200) {
                setMessageAlert(data?.message);
                setIsOpenModal(true);
                setTypeModal('danger');
                return;
            }
            setMessageAlert(data?.message);
            setIsOpenModal(true);
            setTypeModal('success');
            setReloadRoles(!reloadRoles);
            return;
        } catch (error) {
            setMessageAlert(error?.message);
            setIsOpenModal(true);
            setTypeModal('danger');
            return;
        }
    }

    const handleGetResources = async () => {
        try {
            let token = getToken();
            let response = await fetch(`${url.BASE_URL}${url.GET_RESOURCES_ROLE}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            return data?.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const handleGetRoles = async () => {
        try {
            let token = getToken();
            let response = await fetch(`${url.BASE_URL}${url.GET_ROLES}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            return data?.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const handleSliceRoleAdmin = async (roles) => {
        if (!roles) return [];
        let _isAdmin = await isAdminValidate();
        if (!_isAdmin) {
            let rolesFiltrados = roles.filter((role) => role?.name !== "admin" && role?.name !== "root");
            return rolesFiltrados;
        }
        return roles;
    }


    useEffect(() => {
        handleGetResources()
            .then(data => {
                setAvailableResources(data);
                handleGetRoles()
                    .then(data => {
                        handleSliceRoleAdmin(data)
                            .then(data => {
                                setRoles(data);
                                let paginatedRoles = handlePagination(data);
                                setFilteredRoles(paginatedRoles);
                                setSelectedRole(data[0]?._id);
                                const _currentRole = data[0];
                                setCurrentRole(_currentRole);
                            })
                            .catch(error => {
                                console.log(error);
                            })
                            .finally(() => {
                                setLoading(false);
                            });
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
            .catch(error => {
                console.log(error);
            })
    }, [reloadRoles]);

    useEffect(() => {
        if (!selectedRole) return;
        if (!roles || !roles.length) return;
        const _currentRole = roles.find((role) => role?._id === selectedRole);
        setCurrentRole(_currentRole);
    }, [selectedRole, roles]);

    useEffect(() => {
        setFilteredRoles(handleFilterRoles());
    }, [searchTerm, currentPage]);

    if (loading) {
        return <div className="d-flex justify-content-center"><div className="spinner-border text-primary" role="status"><span className="sr-only">Cargando...</span></div></div>;
    } else {
        return (
            <Row>
                {
                    isOpenModal && (
                        <AlertCustom
                            messsageAlert={messsageAlert}
                            typeAlert={typeModal}
                            isOpen={isOpenModal}
                        />
                    )
                }

                {
                    loading && (
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Cargando...</span>
                            </div>
                        </div>
                    )
                }
                <Col xs={12} md={4}>
                    <Card >
                        <CardHeader>
                            <div className='d-flex gap-2 justify-content-between width-full'>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                    }}>
                                    <Input
                                        style={{ width: "80%" }}
                                        className='form-control space-y-2'
                                        type="text"
                                        placeholder="Buscar rol..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        children={
                                            <i className="ri-search-line"></i>
                                        }

                                    />
                                    {searchTerm && (
                                        <Button
                                            style={{ width: "18%" }}
                                            size='md'
                                            color="primary"
                                            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                                            onClick={() => {
                                                setSearchTerm("");
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <i className="ri-close-line"></i>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                <div className="space-y-2"
                                    style={{
                                        maxHeight: '12.188em',
                                        overflow: 'auto',
                                        height: '12.188em'
                                    }}>
                                    {(filteredRoles ?? []).length > 0 &&
                                        filteredRoles.map((role) => (
                                            <div
                                                style={{ width: "100%", marginBottom: "1rem" }}
                                                key={role?._id}
                                                className="flex items-center justify-between">
                                                <Button
                                                    style={{ width: "80%" }}
                                                    size='md'
                                                    color={selectedRole === role._id ? "primary" : "light"}
                                                    onClick={() => setSelectedRole(role?._id)}
                                                >
                                                    {role?.name}
                                                </Button>
                                                <Button
                                                    disabled={role?.name === "admin" || role?.name === "root" || role?.name === "default"}
                                                    style={{ width: "18%", marginLeft: "5px" }}
                                                    color="light"
                                                    size="sm"
                                                    onClick={() => deleteRole(role?._id)}
                                                >
                                                    <i
                                                        style={{ fontSize: "1.5em" }}
                                                        className="ri-delete-bin-6-line text-danger-foreground"></i>
                                                </Button>
                                            </div>
                                        ))}
                                </div>

                                {/* Paginación */}
                                {totalPages > 1 && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            color="light"
                                            size="sm"
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                        >
                                            <i className="ri-arrow-left-line"></i>
                                        </Button>
                                        <span className="text-sm p-2">Página {currentPage} de {totalPages}</span>
                                        <Button
                                            color="light"
                                            size="sm"
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                        >
                                            <i className="ri-arrow-right-line"></i>
                                        </Button>
                                    </div>
                                )}

                                <div className="pt-4 border-t">
                                    <h3 className="text-sm font-medium mb-2">Agregar nuevo rol</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <Label htmlFor="roleName">Nombre del rol</Label>
                                            <Input
                                                id="roleName"
                                                value={newRoleName}
                                                onChange={(e) => setNewRoleName(e.target.value)}
                                                placeholder="Ingrese nombre del rol"
                                            />
                                        </div>
                                        <div className='mt-2'>
                                            <Label htmlFor="roleDescription">Descripción</Label>
                                            <Input
                                                id="roleDescription"
                                                value={newRoleDescription}
                                                onChange={(e) => setNewRoleDescription(e.target.value)}
                                                placeholder="Ingrese descripción"
                                            />
                                        </div>

                                        <Button
                                            style={{ width: "100%" }}
                                            color="primary"
                                            size="md"
                                            className="mr-2 mt-3 w-full"
                                            onClick={addNewRole}
                                        >
                                            <span className='ml-2'>Agregar rol</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col xs={12} md={8}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Permisos [{currentRole?.name}] </CardTitle>
                            <span>Configurar a qué recursos puede acceder este rol</span>
                        </CardHeader>
                        <CardBody>
                            {currentRole && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-medium mb-2">Detalles del rol</h3>
                                        <p className="text-sm text-muted-foreground">{currentRole?.description}</p>
                                    </div>

                                    <div >
                                        <h3 className="text-sm font-medium mb-2">Acceso a recursos</h3>
                                        <div className="space-y-2"
                                            style={{
                                                maxHeight: '19em',
                                                height: '19em',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                width: '100%',
                                                overflow: 'auto',
                                            }}
                                        >
                                            {availableResources.map((resource) => (
                                                <div
                                                    key={resource?._id}
                                                    style={{ display: 'flex', alignItems: 'start' }}
                                                    className='flex items-center gap-2'
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name="resource"
                                                        id={`resource-input-${resource?._id}`}
                                                        className="form-check-input cursor-pointer flex items-center justify-center text-current"
                                                        checked={(currentRole?.resources ?? []).includes(resource?.path)}
                                                        onChange={() => handleResourceToggle(resource?.path)}
                                                    />

                                                    <div className="flex-1 min-w-0">
                                                        <label
                                                            htmlFor={`resource-label-${resource?.name}`}
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            {resource.path}
                                                        </label>
                                                        <p className="text-sm text-muted-foreground">{resource?.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Button
                                        color="primary"
                                        size="md"
                                        className="mr-2"
                                        onClick={addResourcesToRole}
                                    >
                                        Guardar cambios
                                    </Button>
                                    {<span className={`mx-2 ${typeModal === 'success' ? 'text-success' : 'text-danger'}`}>{messsageAlert}</span>}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>

            </Row>
        )
    }
};

export default AdminRolesContent;