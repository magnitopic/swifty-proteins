
interface MmcifToPdbOptions {
  includeConect?: boolean;
}

async function getEntryId(ligandId: string) {
  const query = {
    "query": {
      "type": "terminal",
      "service": "text",
      "parameters": {
        "attribute": "rcsb_chem_comp_container_identifiers.comp_id",
        "operator": "exact_match",
        "value": ligandId
      }
    },
    "return_type": "entry"
  };

  const jsonQuery = JSON.stringify(query);
  const url = `https://search.rcsb.org/rcsbsearch/v2/query?json=${encodeURIComponent(jsonQuery)}`;

  const response = await fetch(url);
  const data = await response.json();

  // ID of the first entry found (ej: 3W2S)
  return data.result_set[0].identifier;
}

function convertMmcifToPdb(mmcifText: string, options: MmcifToPdbOptions = { includeConect: true }): string {
  const lines = mmcifText.split('\n');
  const pdbLines: string[] = [];

  // Identify column indices dynamically
  const atomSiteHeaders: string[] = [];
  let inAtomLoop = false;
  let atomDataStartIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('_atom_site.')) {
      atomSiteHeaders.push(line);
      continue;
    }

    if (atomSiteHeaders.length > 0 && (line.startsWith('HETATM') || line.startsWith('ATOM'))) {
      atomDataStartIndex = i;
      break;
    }
  }

  if (atomDataStartIndex === -1) return "Error: No se encontraron datos de átomos.";

  const getIdx = (label: string) => atomSiteHeaders.indexOf(`_atom_site.${label}`);

  const idx = {
    group: getIdx('group_PDB'),
    id: getIdx('id'),
    symbol: getIdx('type_symbol'),
    label_atom: getIdx('label_atom_id'),
    label_comp: getIdx('label_comp_id'),
    cartnX: getIdx('Cartn_x'),
    cartnY: getIdx('Cartn_y'),
    cartnZ: getIdx('Cartn_z'),
    occ: getIdx('occupancy'),
    temp: getIdx('B_iso_or_equiv'),
    chain: getIdx('auth_asym_id'),
    seq: getIdx('auth_seq_id')
  };

  // Process atom lines and generate HETATM
  for (let i = atomDataStartIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line === '#' || line.startsWith('loop_')) break;

    const parts = line.split(/\s+/);

    // Strict PDB (Column-based)
    const record = parts[idx.group].padEnd(6);               // 1-6
    const serial = parts[idx.id].padStart(5);                // 7-11
    const name = ` ${parts[idx.label_atom]}`.padEnd(4);      // 13-16
    const resName = parts[idx.label_comp].padStart(3);       // 18-20
    const chainId = (parts[idx.chain] || 'A').substring(0, 1); // 22
    const resSeq = parts[idx.seq].padStart(4);               // 23-26

    const x = parseFloat(parts[idx.cartnX]).toFixed(3).padStart(8); // 31-38
    const y = parseFloat(parts[idx.cartnY]).toFixed(3).padStart(8); // 39-46
    const z = parseFloat(parts[idx.cartnZ]).toFixed(3).padStart(8); // 47-54

    const occ = parts[idx.occ].padStart(6);                  // 55-60
    const temp = parts[idx.temp].padStart(6);                // 61-66
    const element = parts[idx.symbol].padStart(12);          // 77-78 

    pdbLines.push(`${record}${serial} ${name} ${resName} ${chainId}${resSeq}    ${x}${y}${z}${occ}${temp}${element}`);
  }

  // TODO: (Optional) Generate CONECT lines (Simplified logic)


  pdbLines.push("END");
  return pdbLines.join('\n');
}

async function getPdbFile(ligandId: string) {
  const entryId = await getEntryId(ligandId);
  const url = `https://models.rcsb.org/v1/${entryId}/ligand?label_comp_id=${ligandId}&encoding=pdb`;
  const response = await fetch(url);
  const data = await response.text();
  const pdb = convertMmcifToPdb(data);
  return pdb;
}

export { getEntryId, getPdbFile };
