import React from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from './ui/table'

export default function TableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableCell>
                        <div className="h-5 bg-gray-100 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                        <div className="h-5 bg-gray-100 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                        <div className="h-5 bg-gray-100 animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                        <div className="h-5 bg-gray-100 animate-pulse"></div>
                    </TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className='w-[10rem]'>
                        <div className="h-5 bg-gray-100 animate-pulse"></div>
                    </TableCell>
                    <TableCell className='w-auto'>
                        <div className="h-5 bg-gray-100 animate-pulse"></div>
                    </TableCell>
                    <TableCell className='w-auto'>
                        <div className="h-5 bg-gray-100 animate-pulse"></div>
                    </TableCell>
                    <TableCell className='w-[5rem]'>
                        <div className="h-5 bg-gray-100 animate-pulse"></div>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className='w-[10rem]'>
                        <div className="h-5 bg-gray-100 animate-pulse"></div>
                    </TableCell>
                    <TableCell className='w-auto'>
                        <div className="h-5 bg-gray-100 animate-pulse"></div>
                    </TableCell>
                    <TableCell className='w-auto'>
                        <div className="h-5 bg-gray-100 animate-pulse"></div>
                    </TableCell>
                    <TableCell className='w-[5rem]'>
                        <div className="h-5 bg-gray-100 animate-pulse"></div>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className='w-[10rem]'>
                        <div className="h-5 bg-gray-100 animate-pulse"></div>
                    </TableCell>
                    <TableCell className='w-auto'>
                        <div className="h-5 bg-gray-100 animate-pulse"></div>
                    </TableCell>
                    <TableCell className='w-auto'>
                        <div className="h-5 bg-gray-100 animate-pulse"></div>
                    </TableCell>
                    <TableCell className='w-[5rem]'>
                        <div className="h-5 bg-gray-100 animate-pulse"></div>
                    </TableCell>
                </TableRow>

            </TableBody>
        </Table>
    )
}
