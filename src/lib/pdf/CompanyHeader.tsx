import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from './styles';

export interface PdfCompany {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  siret: string;
  tvaNumber: string;
}

export function CompanyInfoBlock({ company }: { company: PdfCompany }) {
  return (
    <View>
      <Text style={pdfStyles.companyName}>{company.name}</Text>
      <Text style={pdfStyles.smallText}>{company.address}</Text>
      <Text style={pdfStyles.smallText}>
        {company.postalCode} {company.city}
      </Text>
      <Text style={pdfStyles.smallText}>Tél : {company.phone}</Text>
      <Text style={pdfStyles.smallText}>{company.email}</Text>
      <Text style={pdfStyles.smallText}>SIRET : {company.siret}</Text>
      <Text style={pdfStyles.smallText}>TVA : {company.tvaNumber}</Text>
    </View>
  );
}
