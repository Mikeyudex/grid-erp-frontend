import React, { useState, useEffect } from 'react';
import Papa from "papaparse";
import { Button, Card, CardBody, CardHeader, Col, Input, Row, Tooltip } from 'reactstrap';

import * as url from '../../../../helpers/url_helper';
import TableAdminUsers from './TableUi';
import AlertCustom from '../../../../Components/Common/Alert';
import { getToken } from '../../../../helpers/jwt-token-access/get_token';
import { AdministrationHelper } from '../helpers/administration-helper';

const administrationHelper = new AdministrationHelper();

const AdminUsersContent = () => {

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messsageAlert, setMessageAlert] = useState("");
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [typeModal, setTypeModal] = useState('success');
    const [getUsers, setGetUsers] = useState(false);
    const [reloadUsers, setReloadUsers] = useState(false);
    const [disableBtnReload, setDisableBtnReload] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [tooltipClear, setTooltipClear] = useState(false);
    const [tooltipExport, setTooltipExport] = useState(false);
    const [tooltipReload, setTooltipReload] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [totalPages, setTotalPages] = useState(1);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const handleGetUsers = async () => {
        try {
            setIsOpenModal(false);
            setMessageAlert('');
            setTypeModal('success');

            const response = await administrationHelper.getUsers();

            if (!response.ok) {
                setMessageAlert(data?.message);
                setIsOpenModal(true);
                setTypeModal('danger');
                return;
            }
            const data = await response.json();
            setUsers(data?.data ?? []);
            const roles = await handleGetRoles();
            setRoles(roles ?? []);
            let paginatedUsers = handlePagination(data?.data ?? []);
            setFilteredUsers(paginatedUsers);
        } catch (error) {
            setMessageAlert(error?.message ?? 'Error al obtener usuarios');
            setIsOpenModal(true);
            setTypeModal('danger');
        }
    };

    const handleGetRoles = async () => {
        try {
            let token = getToken();
            const response = await fetch(`${url.BASE_URL}${url.GET_ROLES}`, {
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
    };

    const handleFilterUsers = () => {
        const normalizedSearch = search?.toLowerCase().trim();

        const filteredUsers = (users ?? []).filter((user) => {
            const matchesSearch =
                !normalizedSearch ||
                user?.name?.toLowerCase().includes(normalizedSearch) ||
                user?.lastname?.toLowerCase().includes(normalizedSearch) ||
                user?.email?.toLowerCase().includes(normalizedSearch) ||
                user?.id?.toLowerCase().includes(normalizedSearch) ||
                user?.documento?.toString().includes(normalizedSearch);

            const matchesStatus =
                !statusFilter || `${user?.active}` === statusFilter;

            const matchesDate =
                !dateFilter || user?.createdAt?.startsWith(dateFilter);

            return matchesSearch && matchesStatus && matchesDate;
        });

        return handlePagination(filteredUsers);
    };

    const handlePagination = (_users) => {
        // Calcular total de páginas
        let totalPages = Math.ceil(_users.length / itemsPerPage);

        // Obtener los mensajes de la página actual
        const paginatedUsers = _users.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
        setTotalPages(totalPages);
        return paginatedUsers;
    };

    const handleReloadUsers = () => {
        setReloadUsers(!reloadUsers);
        setDisableBtnReload(true);
        setTimeout(() => {
            setDisableBtnReload(false);
        }, 60000);
    };

    const exportToCSV = () => {
        const csvData = filteredUsers.map((user) => ({
            ID: user?._id,
            nombre: user?.name,
            apellidos: user?.lastname,
            email: user?.email,
            active: user?.active,
            "Fecha Creación": user?.createdAt,
            "Fecha Última Modificación": user?.updatedAt,
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "broadcast-whatsapp-export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        handleGetUsers()
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [getUsers, reloadUsers]);

    useEffect(() => {
        setFilteredUsers(handleFilterUsers());
    }, [search, statusFilter, dateFilter, currentPage]);

    return (

        <Row>
            <Col xs={12} md={12}>
                <Card>
                    <CardHeader>
                        <div className="d-flex gap-2">
                            <Input
                                type="text"
                                placeholder="Buscar por nombre, documento, email o ID"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <Input
                                type="select"
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="">Todos los estados</option>
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </Input>
                            <Input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => {
                                    setDateFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <Button
                                id="reloadUsersBtn"
                                color="primary"
                                size="sm"
                                className="mr-2"
                                onClick={handleReloadUsers}
                                disabled={disableBtnReload}
                            >
                                <i className="ri-refresh-line p-1"></i>
                                <Tooltip
                                    placement="top"
                                    isOpen={tooltipReload}
                                    target="reloadUsersBtn"
                                    toggle={() => setTooltipReload(!tooltipReload)}
                                >
                                    Recargar los datos
                                </Tooltip>
                            </Button>
                            <Button
                                id="clearFiltersBtn"
                                color="primary"
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("");
                                    setDateFilter("");
                                    setCurrentPage(1);
                                }}>
                                <i className="ri-close-line"></i>
                                <Tooltip
                                    placement="top"
                                    isOpen={tooltipClear}
                                    target="clearFiltersBtn"
                                    toggle={() => setTooltipClear(!tooltipClear)}
                                >
                                    Restablece todos los filtros
                                </Tooltip>

                            </Button>
                            <Button
                                id="exportCsvBtn"
                                color="success"
                                onClick={exportToCSV}>
                                <i className="ri-file-excel-2-fill"></i>
                                <Tooltip
                                    placement="top"
                                    isOpen={tooltipExport}
                                    target="exportCsvBtn"
                                    toggle={() => setTooltipExport(!tooltipExport)}
                                >
                                    Descarga los datos en CSV
                                </Tooltip>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody>
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
                        <TableAdminUsers
                            usersData={filteredUsers}
                            setGetUsers={setGetUsers}
                            getUsers={getUsers}
                            totalPages={totalPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            roles={roles}
                        />
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
};

export default AdminUsersContent;