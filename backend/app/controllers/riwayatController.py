from app.extensions import db
from app.models.perhitunganModel import PerhitunganModel
from app.models.detailPerhitungan import DetailPerhitunganModel
from flask import jsonify

class RiwayatController:
    def get_riwayat(self):
        try:
            data = PerhitunganModel.query.order_by(PerhitunganModel.created_at.asc()).all()
            if data is None:
                return jsonify({'message': 'No riwayat found'}), 404
            riwayat_data = [x.to_dict() for x in data]
            return jsonify({'riwayat': riwayat_data}), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
    def get_detail_riwayat(self, perhitungan_id):
        try:
            detail = DetailPerhitunganModel.query.filter_by(id=perhitungan_id).first()

            if not detail:
                return jsonify({'error': 'Not found'}), 404

            return jsonify(detail.to_dict()), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500
