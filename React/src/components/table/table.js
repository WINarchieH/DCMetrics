import React, {useMemo,useState,useEffect,useRef} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import './table.scss';

// Table Components
import { useTable,usePagination,useFilters,useGlobalFilter,useRowSelect,useColumnOrder,useSortBy } from 'react-table';
import { useExportData } from 'react-table-plugins';
import {SingleValueFilter,FilterTitle} from './filters';
import {filterText,filterEquality,filterContains,filterDatesRange,filterDatesRangePicker,
    filterFromDate,filterToDate,everything,filtergreaterthanEquality} from './filterTypes';
import Toolbar from './toolbar';
import {ActionsCell, CheckboxCell} from './tableCells';

import Modal from '../containers/modal/modal';
import {CircleProgress} from '../loadingIndicator/loadingIndicator';

// Material UI 
import MaUTable from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from './tablePaginationActions';
import TableRow from '@material-ui/core/TableRow';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';


// Draggable Features
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Export Data
import {getExportFileBlob} from './export';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import FilterNoneIcon from '@material-ui/icons/FilterNone';

import ExportExcelIcon from '../../components/icons/Download_Excel.png';
import ExportPdfIcon from '../../components/icons/Export PDF.png'

const Table = ({data, tableColumns, title, fixTable, CheckBoxComponent, AdditionalButtons,FetchTotalButton,
    addHandler, editHandler, deleteHandler, conditionalAction, conditionalAction2, isLoading,
    isError, saveName, defaultFilters, defaultColumnHide, defaultColumnHideHandler}) => {
    /**
     * Component for Table UI with Material UI Aesthetic
     * 
     * @param {object array} data - table data
     * @param {object array} tableColumns - column header/cell type/filter type information
     * @param {bool} fixTable (optional) - set true to force all columns to be of equal width 
     * @param {component} CheckBoxComponent - component for checkbox buttons
     * @param {component} AdditionalButtons - component of additional buttons for the toolbars
     * @param {component} FetchTotalButton - component of additional buttons for the toolbars
     * @param {string} title - table title
     * @param {func} addHandler - event on add 
     * @param {func} editHandler - event on edit
     * @param {func} deleteHandler - event on delete
     * @param {func} conditionalAction - function returning action on row condition (jsx) eg. show a button if row is manager
     * @param {func} conditionalAction2 - function returning action on row condition (jsx) eg. show a button if row is manager
     * @param {bool} isLoading - refers to whether table is currently loading
     * @param {bool} isError - error messsage when table failed to load
     * @param {string} saveName - name of save file. If NULL, title is used.
     * @param {object array} defaultFilters - an array of objects of the form {id: '', value: ''} for default filtering
     * @param {string array} defaultColumnHide (optional) - specifies the columns that are hidden by default
     * @param {func} defaultColumnHideHandler (optional) - function to save updated hidden columns. Takes array of column ids as input.
     */

    const user = useSelector(store => store.user);
    const currentColOrder = useRef();
    const setTableColumnsEven = useRef(false);
    const hideDefaultColCheck = useRef(true);

    // Filter Options
    const filterTypes = useMemo(() => ({
        everything: everything,
        date: filterDatesRange,
        dateFrom: filterFromDate,
        dateTo: filterToDate,
        datepicker: filterDatesRangePicker,
        equality: filterEquality,
        contains: filterContains,
        text: filterText,
        greaterthan:filtergreaterthanEquality
    }), []);
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
      };

    // Pagination Helper Functions
    const handleChangePage = (event, newPage) => {
        gotoPage(newPage)
    };
    
    const handleChangeRowsPerPage = event => {
        setPageSize(Number(event.target.value))
    };

    // Default Column Renders
    const defaultColumn = {
        Filter: SingleValueFilter
    };

    // Initial Page State
    const initialPageState = {
        pageIndex: 0,
        pageSize: 50,
        filters: defaultFilters ? defaultFilters : []
    };

    // Export file names generated from saveName or title
    const getExportFileName = () => {
        if (saveName) {
            return saveName.replace(/\s/g, "-");
        }
        return title ? title.replace(/\s/g, "-") + '-' + user : 'Data';
      };;

    // Construct Table Instance
    const {getTableProps, getTableBodyProps, headerGroups, prepareRow, visibleColumns, exportData,
        page, gotoPage, setPageSize, // Paginate hooks
        preGlobalFilteredRows, setGlobalFilter, // Filter hooks
        setColumnOrder, allColumns, // Column drag and order
        state: { pageIndex, pageSize, selectedRowIds, globalFilter }} = useTable({
            columns: tableColumns, data: data, defaultColumn, initialState: initialPageState, filterTypes, 
            editHandler, deleteHandler, conditionalAction, conditionalAction2, getExportFileBlob, getExportFileName},
        useColumnOrder, useFilters, useGlobalFilter, useSortBy, usePagination, useRowSelect, useExportData,
        hooks => {
            hooks.allColumns.push(columns => {
                if (CheckBoxComponent) {
                    // NOTE. Adding checkbox column and button column
                    return ([
                        {
                            id: 'CheckBox',
                            Header: ({ getToggleAllRowsSelectedProps }) => (null),
                            Cell: ({ row }) => (
                                <div>
                                    <CheckboxCell {...row.getToggleRowSelectedProps()} />
                                </div>),
                            Filter: ({ getToggleAllRowsSelectedProps }) => (
                                <div>
                                    <CheckboxCell {...getToggleAllRowsSelectedProps()} />   
                                </div>),
                        },
                        {
                            id: 'RowActions',
                            Header: () => ('Actions'),
                            Cell: ActionsCell,
                            Filter: FilterTitle,
                        },
                        ...columns
                    ])
                }
                else {
                    // Note. Only add button column (add, delete,...)
                    return ([
                        {
                            id: 'RowActions',
                            Header: () => ('Actions'),
                            Cell: ActionsCell,
                            Filter: FilterTitle,
                        },
                        ...columns
                    ])
                }
            })
        });
    
    const ExportButtons = () => {
        return (
            <React.Fragment>
                <Tooltip title='Export PDF'>
                    <IconButton aria-label='ExportPDF' onClick={() => {exportData("pdf", false);}}> 
                        <img  width ={30} height ={30} src={ExportPdfIcon}></img>
                    </IconButton>
                </Tooltip>
                <Tooltip title='Export Excel'>
                    <IconButton aria-label='ExportCSV' onClick={() => {exportData("xlsx", false);}}>
                    <img  width ={30} height ={30} src={ExportExcelIcon}></img>
                    </IconButton>
                </Tooltip>
            </React.Fragment>
        );
    };

    const updateDefaultCol = (e) => {
        e.preventDefault();
        console.log(visibleColumns);
        let visCols = visibleColumns.map(x => {
            if (x.isVisible && x.id !== 'RowActions') {
                return x.id;
            }
            return null;
        }).filter(x => x);
        defaultColumnHideHandler(visCols);
    }

    useEffect(() => { // Make table columns equal width if less than 5 columns
        if (visibleColumns && visibleColumns.length < 8) {
            setTableColumnsEven.current = true;
        }
        else {
            setTableColumnsEven.current = false;
        }
    },[visibleColumns]);

    useEffect(() => { 
        if (defaultColumnHide && hideDefaultColCheck.current) {
            hideDefaultColCheck.current = false; // Variable to ensure default column hide only occurs once. Otherwise, columns can not be made visible.
            visibleColumns.forEach((column, idx) => {
                if (defaultColumnHide.includes(column.id)) { // Set columns (database column name, eg. UserID) invisible if in defaultColumnHide
                    visibleColumns[idx].toggleHidden();
                }
            });
        }
    }, [visibleColumns, defaultColumnHide]);

    return (
        <div className='table-full-container'>
            { (isLoading || isError) ? 
            <div className='loading-container'>
                { isLoading ? <CircleProgress size='5rem'/> :
                <div>
                    Error connecting to server. 
                    Please try again.
                </div>
                }
            </div>
            : null }
            <Toolbar title={title} 
                addHandler={addHandler} 
                columns={allColumns} 
                menuHandler={openModal} 
                CheckBoxComponent={CheckBoxComponent} 
                ExportButtons={ExportButtons}
                selectedRowIds={CheckBoxComponent ? selectedRowIds : null} 
                numSelected={CheckBoxComponent ? Object.keys(selectedRowIds).length : null}
                AdditionalButtons={AdditionalButtons}
                FetchTotalButton = {FetchTotalButton}
                preGlobalFilteredRows={preGlobalFilteredRows} 
                setGlobalFilter={setGlobalFilter}  
                globalFilter={globalFilter}/>
            <div className='table-container'>
                <MaUTable stickyHeader {...getTableProps()} className={(fixTable || setTableColumnsEven.current ) ? 'table--equal-width' : null}>
                    <TableHead style={{padding:'0px'}}>
                    {headerGroups.map(headerGroup => {
                            const {key} = headerGroup.getHeaderGroupProps();
                            return (
                                <DragDropContext key={key}
                                    onDragStart={() => {
                                        currentColOrder.current = allColumns.map(o => o.id);
                                    }}
                                    onDragUpdate={(dragUpdateObj, b) => {

                                    const colOrder = [...currentColOrder.current];
                                    const sIndex = dragUpdateObj.source.index;
                                    const dIndex =
                                    dragUpdateObj.destination && dragUpdateObj.destination.index;

                                    if (typeof sIndex === "number" && typeof dIndex === "number") {
                                        colOrder.splice(sIndex, 1);
                                        colOrder.splice(dIndex, 0, dragUpdateObj.draggableId);
                                        setColumnOrder(colOrder);
                                    }
                                }}
                                >
                                    <Droppable droppableId='droppable' direction='horizontal'>
                                    { (droppableProvided, snapshot) => (
                                        <React.Fragment>
                                            <TableRow {...headerGroup.getHeaderGroupProps()} key={key+'header'} ref={droppableProvided.innerRef}>
                                                {droppableProvided.placeholder}
                                                {headerGroup.headers.map( (column,index) =>(
                                                    <Draggable
                                                          key={column.id}
                                                        draggableId={column.id}
                                                        index={index}
                                                        isDragDisabled={!column.accessor}
                                                    >
                                                    {(provided,snapshot) => {
                                                        // NOTE. Displays header and column sorting symbols (up or down)
                                                        return (
                                                            <TableCell classes={column.id !== 'CheckBox' ? {root: 'table-header table-item table-header-cell'} : null} 
                                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                                            {...provided.draggableProps} ref={provided.innerRef}
                                                            {...provided.dragHandleProps}>
                                                                {column.render('Header')} 
                                                                {column.isSorted ? ' ' : null}
                                                                {column.isSorted ?
                                                                    (column.isSortedDesc ?
                                                                    <ArrowDownwardIcon fontSize='small' className='table-header--icon'/> :
                                                                    <ArrowUpwardIcon fontSize='small' className='table-header--icon'/>) :
                                                                  ''}
                                                                {provided.placeholder}
                                                            </TableCell>
                                                        );
                                                    }}
                                                    </Draggable>
                                                    ))}
                                            </TableRow>
                                            <TableRow {...headerGroup.getHeaderGroupProps()} key={key+'filter'} style={{padding:'0px'}}>
                                                {headerGroup.headers.map(column =>  {
                                                    // NOTE. Displays filter row
                                                    return (<TableCell {...column.getHeaderProps()} className='table-header-cell' style={{ top: 57,padding:'5px',paddingLeft:'16px', paddingTop:'10px',}}
                                                        classes = {column.id !== 'CheckBox' ? {root: 'table-header table-item--fit-width table-item--no-wrap'} : null}>{column.render('Filter')}</TableCell>)
                                                })}
                                            </TableRow>
                                        </React.Fragment>
                                    )}
                                    </Droppable>
                                </DragDropContext>
                            )
                        })}
                    </TableHead>
                        <TableBody {...getTableBodyProps()}>
                            {page.map(row => {
                                // NOTE. Displays each table cell, including checkbox, and conditional highlighting
                                prepareRow(row)
                                return (
                                    <TableRow {...row.getRowProps()}>
                                        {row.cells.map(cell => {
                                            let cellStyle = 'table-item table-item--padding ';
                                            if (cell.column.ConditionalHighlighting) {
                                                let highlighting = cell.column.ConditionalHighlighting(cell.value) || '';
                                                cellStyle += highlighting;
                                            }
                                            return (<TableCell 
                                                classes={cell.column.id  !== 'CheckBox' ? {root: cellStyle} : null} 
                                                {...cell.getCellProps()} style={{padding:'2px',paddingLeft:'16px'}}>{cell.render('Cell')}</TableCell>)})}
                                    </TableRow>
                                )})}
                        </TableBody>
                </MaUTable>       
            </div>
            <MaUTable>
                <TableFooter classes={{root: 'table-footer'}} style={{padding:'0%'}}>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[
                                50,
                                100,
                                150,
                                200,
                            ]}
                            colSpan={3}
                            count={data.length}
                            rowsPerPage={pageSize}
                            page={pageIndex}
                            SelectProps={{
                                inputProps: { 'calibri': 'rows per page' },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </MaUTable>
            <Modal title='Filter' showModal={showModal} setShowModal={setShowModal}
                buttonName={defaultColumnHideHandler ? 'Save' : null} onSubmit={updateDefaultCol} >
                {allColumns.map(column => {
                    // Note. Menu for displaying which columns are visible via checkboxes
                    if (column.id !== 'RowActions' && column.id !== 'CheckBox') {
                        return (
                        <div key={column.id}>
                            <label>
                            <input type="checkbox" {...column.getToggleHiddenProps()} />{' '}
                            {column.Header}
                            </label>
                        </div>
                        );
                    }
                    return null;
                })}
            </Modal>
        </div>);
};

Table.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    tableColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
    title: PropTypes.string,
    addHandler: PropTypes.func, 
    editHandler: PropTypes.func, 
    deleteHandler: PropTypes.func,
    fixTable: PropTypes.bool
}

export default Table;