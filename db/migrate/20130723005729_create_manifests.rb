class CreateManifests < ActiveRecord::Migration
  def change
    create_table :manifests do |t|

      t.timestamps
    end
  end
end
