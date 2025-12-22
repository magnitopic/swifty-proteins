import { Request, Response } from 'express';
import { getPdbFile } from '../services/pdbService';

export const getPdbFileController = async (req: Request, res: Response) => {
  const ligandId = req.params.ligand_id;

  console.log(`Fetching PDB file for ligand: ${ligandId}`);

  try {
    const pdb = await getPdbFile(ligandId);

    if (!pdb) {
      return res.status(404).send({ error: 'PDB file not found for this ligand' });
    }

    res.send(pdb);
  } catch (error) {
    console.error('Error trying to get pdb file:', error);
    res.status(500).send({
      error: 'Error trying to get pdb file',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
